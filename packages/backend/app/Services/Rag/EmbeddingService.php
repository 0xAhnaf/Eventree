<?php

namespace App\Services\Rag;

use Illuminate\Support\Facades\Http;

class EmbeddingService
{
    /** @param string[] $texts  @return float[][] */
    public function embed(array $texts): array
    {
        $response = Http::withToken(config('services.openrouter.key'))
            ->timeout(60)
            ->retry(2, 500)
            ->post(config('services.openrouter.base_url') . '/embeddings', [
                'model' => config('services.openrouter.embedding_model'),
                'input' => array_values($texts),
            ])
            ->throw();

        return collect($response->json('data'))
            ->sortBy('index')
            ->pluck('embedding')
            ->values()
            ->all();
    }
}