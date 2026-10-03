<?php

namespace App\Services\Rag;

use Illuminate\Support\Facades\Http;

class ChatbotService
{
    private const MAX_STEPS = 5;

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are an Eventree AI assistant for a platform where customers find and book event vendors.

SCOPE RULE (highest priority): You only answer questions about Eventree, its vendors, bookings, and how the platform works. For anything else reply exactly:
"I can only help with questions about Eventree."
Do not ask clarifying questions about off-topic requests.

Use search_vendors for vendor questions and search_knowledge for platform questions.
Answer only from tool results. Never invent vendors, prices, ratings, or policies.
Keep answers short. Do not use Markdown (no **bold**, *italics*, headings, or code blocks).
If the tools return nothing relevant, reply exactly: "I couldn't find the information."
PROMPT;

    public function __construct(
        private KnowledgeSearchService $knowledge,
        private VendorKnowledgeService $vendors,
    ) {}

    public function answer(string $question, array $history = []): string
    {
        $messages = [['role' => 'system', 'content' => self::SYSTEM_PROMPT]];
        foreach ($history as $m) {
            $messages[] = ['role' => $m['role'], 'content' => $m['content']];
        }
        $messages[] = ['role' => 'user', 'content' => $question];

        for ($step = 0; $step < self::MAX_STEPS; $step++) {
            $res = Http::withToken(config('services.openrouter.key'))
                ->timeout(60)
                ->post(config('services.openrouter.base_url') . '/chat/completions', [
                    'model'       => config('services.openrouter.chat_model'),
                    'messages'    => $messages,
                    'tools'       => $this->toolDefinitions(),
                    'temperature' => 0.2,
                    'max_tokens'  => 1000,
                ])
                ->throw()
                ->json();

            $message   = $res['choices'][0]['message'] ?? [];
            $toolCalls = $message['tool_calls'] ?? [];

            if (!$toolCalls) {
                return $this->clean($message['content'] ?? "I couldn't find the information.");
            }

            $messages[] = [
                'role'       => 'assistant',
                'content'    => $message['content'] ?? '',
                'tool_calls' => $toolCalls,
            ];

            foreach ($toolCalls as $call) {
                $args = json_decode($call['function']['arguments'] ?? '{}', true) ?: [];
                $messages[] = [
                    'role'         => 'tool',
                    'tool_call_id' => $call['id'],
                    'content'      => json_encode($this->runTool($call['function']['name'], $args)),
                ];
            }
        }

        return "I couldn't find the information.";
    }

    private function runTool(string $name, array $args): mixed
    {
        try {
            return match ($name) {
                'search_vendors'   => $this->vendors->getVendors(
                    array_filter($args, fn ($v) => $v !== null && $v !== '')
                ),
                'search_knowledge' => $this->knowledge->search($args['question'] ?? ''),
                default            => ['error' => "Unknown tool: $name"],
            };
        } catch (\Throwable $e) {
            report($e);
            return ['error' => 'Tool failed'];
        }
    }

    private function clean(string $text): string
    {
        return str_replace(['**', '$'], ['', 'BDT'], $text);
    }

    private function toolDefinitions(): array
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name'        => 'search_vendors',
                    'description' => 'Search Eventree vendors using live database information. Use for questions about vendors, ratings, categories, cities, amenities, or vendor names.',
                    'parameters'  => [
                        'type' => 'object',
                        'properties' => [
                            'min_rating'  => ['type' => 'number'],
                            'category'    => ['type' => 'string'],
                            'city'        => ['type' => 'string'],
                            'amenity'     => ['type' => 'string'],
                            'vendor_name' => ['type' => 'string'],
                        ],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name'        => 'search_knowledge',
                    'description' => "Search Eventree's knowledge base for static platform information (how Eventree works, bookings, policies).",
                    'parameters'  => [
                        'type' => 'object',
                        'properties' => ['question' => ['type' => 'string']],
                        'required'   => ['question'],
                    ],
                ],
            ],
        ];
    }
}