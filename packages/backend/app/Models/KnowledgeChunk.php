<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KnowledgeChunk extends Model
{
    use HasFactory;

    protected $fillable = [
        'source',
        'page',
        'chunk_index',
        'content',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];
}