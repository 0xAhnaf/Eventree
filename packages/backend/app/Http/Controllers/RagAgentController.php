<?php

namespace App\Http\Controllers;

use App\Services\Rag\VendorKnowledgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RagAgentController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => [
                'required',
                'string',
                'max:4000',
            ],

            'history' => [
                'nullable',
                'array',
                'max:8',
            ],

            'history.*.role' => [
                'required',
                'string',
                'in:user,assistant',
            ],

            'history.*.content' => [
                'required',
                'string',
                'max:8000',
            ],
        ]);

        $ragUrl = config(
            'services.rag.url',
            'http://127.0.0.1:8001'
        );

        $response = Http::timeout(90)
            ->post(
                rtrim($ragUrl, '/') . '/chat',
                [
                    'question' => $validated['question'],
                    'history' => $validated['history'] ?? [],
                ]
            );

        if ($response->failed()) {
            return response()->json([
                'message' => 'RAG service failed.',
                'error' => $response->json(),
            ], 502);
        }

        return response()->json(
            $response->json()
        );
    }

    public function vendors(
        Request $request,
        VendorKnowledgeService $vendorKnowledgeService
    ): JsonResponse {
        $filters = [
            'min_rating' => $request->query('min_rating'),
            'category' => $request->query('category'),
            'city' => $request->query('city'),
            'amenity' => $request->query('amenity'),
            'vendor_name' => $request->query('vendor_name'),
        ];

        $filters = array_filter(
            $filters,
            fn ($value) => $value !== null && $value !== ''
        );

        return response()->json([
            'vendors' => $vendorKnowledgeService->getVendors($filters),
        ]);
    }
}