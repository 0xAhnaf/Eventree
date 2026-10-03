<?php

namespace App\Services\Rag;

class TextChunker
{
    public static function split(string $text, int $size = 800, int $overlap = 150): array
    {
        $text = trim(preg_replace('/[ \t]+/', ' ', $text));
        $len = mb_strlen($text);
        $chunks = [];
        $start = 0;

        while ($start < $len) {
            $window = mb_substr($text, $start, $size);

            if ($start + $size < $len) {
                $cuts = array_filter(
                    [mb_strrpos($window, "\n"), mb_strrpos($window, '. '), mb_strrpos($window, ' ')],
                    fn ($v) => $v !== false
                );
                $cut = $cuts ? max($cuts) : false;
                if ($cut !== false && $cut > $size * 0.5) {
                    $window = mb_substr($window, 0, $cut + 1);
                }
            }

            $piece = trim($window);
            if ($piece !== '') {
                $chunks[] = $piece;
            }

            if ($start + mb_strlen($window) >= $len) {
                break;
            }
            $start += max(mb_strlen($window) - $overlap, 1);
        }

        return $chunks;
    }
}