<?php

namespace App\Services\Rag;

use App\Models\KnowledgeChunk;

class KnowledgeSearchService
{
    public function __construct(private EmbeddingService $embeddings) {}

    public function search(string $question, int $k = 3): array
    {
        $queryVector = $this->embeddings->embed([$question])[0];
        $scored = [];

        foreach (KnowledgeChunk::select('id', 'content', 'embedding')->lazy(200) as $chunk) {
            $scored[] = [
                'content' => $chunk->content,
                'score'   => self::cosine($queryVector, $chunk->embedding),
            ];
        }

        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($scored, 0, $k);
    }

    private static function cosine(array $a, array $b): float
    {
        $dot = $normA = $normB = 0.0;
        foreach ($a as $i => $v) {
            $dot   += $v * $b[$i];
            $normA += $v * $v;
            $normB += $b[$i] * $b[$i];
        }
        return ($normA && $normB) ? $dot / (sqrt($normA) * sqrt($normB)) : 0.0;
    }
}