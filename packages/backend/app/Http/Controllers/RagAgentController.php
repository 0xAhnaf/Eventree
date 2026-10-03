<?php

namespace App\Http\Controllers;

use App\Services\Rag\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RagAgentController extends Controller
{
    public function chat(Request $request, ChatbotService $chatbot): JsonResponse
    {
        $validated = $request->validate([
            'question'          => ['required', 'string', 'max:4000'],
            'history'           => ['nullable', 'array', 'max:8'],
            'history.*.role'    => ['required', 'string', 'in:user,assistant'],
            'history.*.content' => ['required', 'string', 'max:8000'],
        ]);

        try {
            $answer = $chatbot->answer(
                $validated['question'],
                $validated['history'] ?? []
            );
        } catch (\Throwable $e) {
            report($e);

            // the widget shows data.message on errors
            return response()->json([
                'message' => 'The assistant is unavailable right now.',
            ], 502);
        }

        return response()->json(['answer' => $answer]);
    }
}