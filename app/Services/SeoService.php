<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * SeoService — resolves per-page SEO metadata from `resources/data/seo.json`.
 *
 * The JSON centralises every `<title>`/`<meta>`/`<link>` of the site. This
 * service turns a page key (e.g. `homepage`, `produit_travaux`) into a
 * normalised payload ready to be serialised as an Inertia prop and consumed by
 * the `<Seo />` React component.
 *
 * Two kinds of dynamic values are resolved here:
 *  - `{{ VARIABLE }}` placeholders → read from config()/env()
 *  - `is_url: true` entries → resolved to an absolute URL depending on
 *    `url_type` ("current" = normalised current URL, "asset" = public asset).
 */
class SeoService
{
    private const CACHE_KEY = 'seo.json';

    /**
     * Query-string parameters stripped from the "current" URL so canonical /
     * og:url tags stay clean and stable.
     *
     * @var list<string>
     */
    private const TRACKING_PARAMS = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid',
        'msclkid',
        'mc_cid',
        'mc_eid',
        'ref',
    ];

    /**
     * Resolve the normalised SEO payload for a given page key.
     *
     * @return array{
     *     title: string,
     *     meta: list<array{name: string, content: string}>,
     *     og: list<array{property: string, content: string}>,
     *     twitter: list<array{name: string, content: string}>,
     *     links: list<array{rel: string, href: string}>
     * }
     */
    public function for(string $pageKey): array
    {
        $data = $this->load();

        if (!isset($data[$pageKey]) || !is_array($data[$pageKey])) {
            // Fail-fast in dev so a missing key is caught immediately; in
            // production, log and fall back to a minimal generic payload so the
            // page still renders.
            if (config('app.debug')) {
                throw new RuntimeException(
                    "SEO key [{$pageKey}] not found in resources/data/seo.json"
                );
            }

            Log::warning('Missing SEO key, using generic fallback.', [
                'page_key' => $pageKey,
            ]);

            return $this->fallback();
        }

        return $this->resolve($data[$pageKey]);
    }

    /**
     * Resolve a raw page block into the normalised payload.
     *
     * @param array<string, mixed> $block
     *
     * @return array{
     *     title: string,
     *     meta: list<array{name: string, content: string}>,
     *     og: list<array{property: string, content: string}>,
     *     twitter: list<array{name: string, content: string}>,
     *     links: list<array{rel: string, href: string}>
     * }
     */
    private function resolve(array $block): array
    {
        $meta = $this->resolveEntries($block['meta'] ?? [], 'name');
        $og = $this->resolveEntries($block['og'] ?? [], 'property');
        $twitter = $this->resolveEntries($block['twitter'] ?? [], 'name');
        $links = $this->resolveEntries($block['links'] ?? [], 'rel', 'href');

        return [
            'title' => $this->resolveTitle($og),
            'meta' => $meta,
            'og' => $og,
            'twitter' => $twitter,
            'links' => $links,
        ];
    }

    /**
     * Resolve a list of raw entries into normalised `{key, content|href}` rows.
     * Entries whose resolved value is empty are dropped to avoid empty tags.
     *
     * @param array<int, array<string, mixed>> $entries
     *
     * @return list<array<string, string>>
     */
    private function resolveEntries(array $entries, string $keyField, string $valueField = 'content'): array
    {
        $resolved = [];

        foreach ($entries as $entry) {
            if (!is_array($entry) || !isset($entry[$keyField])) {
                continue;
            }

            $value = $this->resolveValue($entry);

            if ($value === '') {
                continue;
            }

            $resolved[] = [
                $keyField => (string) $entry[$keyField],
                $valueField => $value,
            ];
        }

        return $resolved;
    }

    /**
     * Resolve a single entry's value: dynamic URL, placeholders, or literal.
     *
     * @param array<string, mixed> $entry
     */
    private function resolveValue(array $entry): string
    {
        if (($entry['is_url'] ?? false) === true) {
            return match ($entry['url_type'] ?? null) {
                'current' => $this->currentUrl(),
                'asset' => asset((string) ($entry['content'] ?? '')),
                default => '',
            };
        }

        return $this->resolvePlaceholders((string) ($entry['content'] ?? ''));
    }

    /**
     * Derive the document title from the `og:title` entry.
     *
     * @param list<array{property: string, content: string}> $og
     */
    private function resolveTitle(array $og): string
    {
        foreach ($og as $entry) {
            if ($entry['property'] === 'og:title') {
                return $entry['content'];
            }
        }

        return (string) config('app.name', '');
    }

    /**
     * Replace every `{{ VARIABLE }}` placeholder with its resolved value.
     */
    private function resolvePlaceholders(string $value): string
    {
        if (!str_contains($value, '{{')) {
            return $value;
        }

        return (string) preg_replace_callback(
            '/\{\{\s*([A-Z0-9_]+)\s*\}\}/',
            fn(array $matches): string => $this->placeholderValue($matches[1]),
            $value
        );
    }

    /**
     * Map a placeholder name to its resolved value from config/env.
     */
    private function placeholderValue(string $name): string
    {
        return match ($name) {
            'APP_NAME' => (string) config('app.name', ''),
            'GOOGLE_SITE_VERIFICATION' => (string) config('services.seo.google_site_verification', ''),
            'BING_SITE_VERIFICATION' => (string) config('services.seo.bing_site_verification', ''),
            'THEME_COLOR' => (string) config('services.seo.theme_color', ''),
            default => (string) config("services.seo.{$name}", env($name, '')),
        };
    }

    /**
     * Current absolute URL, normalised by stripping tracking query strings.
     */
    private function currentUrl(): string
    {
        $request = request();
        $query = array_diff_key($request->query(), array_flip(self::TRACKING_PARAMS));
        $url = $request->url();

        return $query === [] ? $url : $url . '?' . http_build_query($query);
    }

    /**
     * Load and cache the raw decoded SEO data file. Resolution is per-request,
     * so only the static JSON is cached (rememberForever), bypassed in dev.
     *
     * @return array<string, mixed>
     */
    private function load(): array
    {
        if (config('app.debug')) {
            return $this->loadFromDisk();
        }

        /** @var array<string, mixed> $data */
        $data = Cache::rememberForever(self::CACHE_KEY, fn(): array => $this->loadFromDisk());

        return $data;
    }

    /**
     * Read and decode `resources/data/seo.json`.
     *
     * @return array<string, mixed>
     */
    private function loadFromDisk(): array
    {
        $path = resource_path('data/seo.json');

        if (!File::exists($path)) {
            return [];
        }

        /** @var array<string, mixed> $decoded */
        $decoded = json_decode(File::get($path), true) ?? [];

        return $decoded;
    }

    /**
     * Minimal generic payload used when a page key is missing (production).
     *
     * @return array{
     *     title: string,
     *     meta: list<array{name: string, content: string}>,
     *     og: list<array{property: string, content: string}>,
     *     twitter: list<array{name: string, content: string}>,
     *     links: list<array{rel: string, href: string}>
     * }
     */
    private function fallback(): array
    {
        return [
            'title' => (string) config('app.name', ''),
            'meta' => [],
            'og' => [],
            'twitter' => [],
            'links' => [
                ['rel' => 'canonical', 'href' => $this->currentUrl()],
            ],
        ];
    }
}
