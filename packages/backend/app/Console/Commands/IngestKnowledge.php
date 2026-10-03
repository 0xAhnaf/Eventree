<?php

namespace App\Console\Commands;

use App\Models\KnowledgeChunk;
use App\Services\Rag\EmbeddingService;
use App\Services\Rag\TextChunker;
use Illuminate\Console\Command;
use Smalot\PdfParser\Parser;

class IngestKnowledge extends Command
{
    protected $signature = 'rag:ingest {path=app/knowledge.pdf : path relative to storage/}';
    protected $description = 'Chunk the knowledge PDF, embed it, and store it in MySQL';

    public function handle(EmbeddingService $embeddings): int
    {
        $path = storage_path($this->argument('path'));
        if (!is_file($path)) {
            $this->error("File not found: $path");
            return self::FAILURE;
        }

        $pdf = (new Parser())->parseFile($path);
        $rows = [];

        foreach ($pdf->getPages() as $i => $page) {
            foreach (TextChunker::split($page->getText()) as $chunk) {
                $rows[] = ['page' => $i + 1, 'content' => $chunk];
            }
        }

        $this->info(count($rows) . ' chunks to embed...');

        KnowledgeChunk::truncate(); // idempotent: re-running rebuilds everything

        foreach (array_chunk($rows, 32) as $batchIndex => $batch) {
            $vectors = $embeddings->embed(array_column($batch, 'content'));

            foreach ($batch as $j => $row) {
                KnowledgeChunk::create([
                    'source'      => basename($path),
                    'page'        => $row['page'],
                    'chunk_index' => $batchIndex * 32 + $j,
                    'content'     => $row['content'],
                    'embedding'   => $vectors[$j],
                ]);
            }
        }

        $this->info('Done.');
        return self::SUCCESS;
    }
}