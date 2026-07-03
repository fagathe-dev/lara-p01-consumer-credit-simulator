/**
 * Seo Component
 * Renders the document head (title + meta) from server-resolved SEO data.
 *
 * NOTE: the SEO data itself is produced by the dedicated SEO system
 * (`App\Services\SeoService` + `resources/data/seo.json`) and passed as an
 * Inertia prop. Pages must never hardcode <title>/<meta>; they render <Seo />.
 */

import React from "react";
import { Head } from "@inertiajs/react";
import type { SeoData } from "@/types/seo";

export interface SeoProps {
    seo: SeoData;
}

export const Seo: React.FC<SeoProps> = ({ seo }) => (
    <Head title={seo.title}>
        {seo.meta.map((entry) => (
            <meta
                key={`meta:${entry.name}`}
                name={entry.name}
                content={entry.content}
                head-key={entry.name}
            />
        ))}
        {seo.og.map((entry) => (
            <meta
                key={`og:${entry.property}`}
                property={entry.property}
                content={entry.content}
                head-key={entry.property}
            />
        ))}
        {seo.twitter.map((entry) => (
            <meta
                key={`twitter:${entry.name}`}
                name={entry.name}
                content={entry.content}
                head-key={entry.name}
            />
        ))}
        {seo.links.map((entry) => (
            <link
                key={`link:${entry.rel}`}
                rel={entry.rel}
                href={entry.href}
                head-key={entry.rel}
            />
        ))}
    </Head>
);

Seo.displayName = "Seo";
