/**
 * SEO data contract shared between the Laravel `SeoService` (server) and the
 * `<Seo />` component (client). The concrete resolution lives in the dedicated
 * SEO system (`resources/data/seo.json` + `App\Services\SeoService`).
 *
 * The service returns a fully resolved payload (placeholders and dynamic URLs
 * already expanded), so the client only maps arrays to head tags.
 */

/** A `<meta name="..." content="..." />` entry. */
export interface SeoMeta {
    name: string;
    content: string;
}

/** A `<meta property="..." content="..." />` entry (Open Graph). */
export interface SeoOg {
    property: string;
    content: string;
}

/** A `<meta name="..." content="..." />` entry (Twitter cards). */
export interface SeoTwitter {
    name: string;
    content: string;
}

/** A `<link rel="..." href="..." />` entry. */
export interface SeoLink {
    rel: string;
    href: string;
}

export interface SeoData {
    /** Document title, derived server-side from `og:title`. */
    title: string;
    meta: SeoMeta[];
    og: SeoOg[];
    twitter: SeoTwitter[];
    links: SeoLink[];
}

/**
 * Base props every public page receives from its Inertia controller.
 */
export interface PageProps {
    seo: SeoData;
}
