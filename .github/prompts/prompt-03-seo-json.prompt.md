# Prompt — Centralisation SEO via `data/seo.json`

## Contexte

Le site compte peu de pages (9 pages fixes, cf. prompt "Pages Web"). Plutôt que de coder les balises `<title>`/`<meta>` dans chaque composant React, **toutes les balises SEO doivent être centralisées dans un unique fichier de configuration `data/seo.json`**, sur le modèle de la structure ci-dessous (déjà utilisée sur un autre projet) :

- Une clé JSON par page
- Pour chaque page : tableaux `meta`, `og`, `twitter`, `links`
- Chaque entrée a la forme `{ name|property|rel, content, is_url, url_type }`
- `is_url: true` signifie que `content` n'est pas une valeur statique mais doit être **résolue dynamiquement** au moment du rendu :
  - `url_type: "current"` → résolu vers l'URL absolue de la page courante
  - `url_type: "asset"` → résolu vers l'URL absolue d'un asset public (image, logo)
- Les valeurs `{{ MA_VARIABLE }}` sont des **placeholders** à résoudre depuis les variables d'environnement (`.env` / `config/`)

Cela remplace/complète la consigne du prompt précédent qui demandait de gérer `<title>`/`<meta>` directement dans chaque page : **on centralise désormais tout dans ce fichier unique**, les composants de page ne doivent plus contenir aucune balise SEO en dur.

---

## 1. Fichier `resources/data/seo.json`

Créer ce fichier avec exactement les 9 clés suivantes (une par route définie dans le prompt "Pages Web"), en respectant fidèlement le format ci-dessous :

```json
{
  "homepage": {
    "meta": [
      { "name": "description", "content": "Simulez votre crédit à la consommation en ligne et obtenez une réponse de principe sous 24h. Prêt auto, travaux, rachat de crédits, prêt personnel : comparez nos offres en 2 minutes." },
      { "name": "author", "content": "{{ APP_NAME }}" },
      { "name": "keywords", "content": "simulation crédit, crédit consommation, prêt auto, prêt travaux, rachat de crédits, simulateur de prêt en ligne" },
      { "name": "google-site-verification", "content": "{{ GOOGLE_SITE_VERIFICATION }}" },
      { "name": "msvalidate.01", "content": "{{ BING_SITE_VERIFICATION }}" },
      { "name": "theme-color", "content": "{{ THEME_COLOR }}" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Simulateur de Crédit en Ligne — Réponse sous 24h", "is_url": false },
      { "property": "og:description", "content": "Simulez votre crédit à la consommation et obtenez une réponse de principe rapide, sans engagement.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/homepage.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Simulateur de Crédit en Ligne — Réponse sous 24h", "is_url": false },
      { "name": "twitter:description", "content": "Simulez votre crédit à la consommation et obtenez une réponse de principe rapide, sans engagement.", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/homepage.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "mentions_legales": {
    "meta": [
      { "name": "description", "content": "Mentions légales, politique de confidentialité RGPD et informations réglementaires relatives à nos offres de crédit à la consommation." },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Mentions Légales & Politique de Confidentialité", "is_url": false },
      { "property": "og:description", "content": "Informations légales, RGPD et réglementaires sur nos services de crédit.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary", "is_url": false },
      { "name": "twitter:title", "content": "Mentions Légales & Politique de Confidentialité", "is_url": false }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "tunnel_step1": {
    "meta": [
      { "name": "description", "content": "Démarrez votre simulation de crédit à la consommation en ligne. Renseignez votre projet, obtenez une estimation immédiate de mensualité et TAEG." },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Simulation de Crédit Consommation — Démarrer ma demande", "is_url": false },
      { "property": "og:description", "content": "Renseignez votre projet et obtenez une simulation immédiate de votre crédit à la consommation.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary", "is_url": false },
      { "name": "twitter:title", "content": "Simulation de Crédit Consommation", "is_url": false }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "tunnel_resultat": {
    "meta": [
      { "name": "description", "content": "Votre demande de crédit à la consommation a bien été prise en compte. Découvrez les prochaines étapes de votre dossier." },
      { "name": "robots", "content": "noindex, nofollow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Votre demande a bien été enregistrée", "is_url": false },
      { "property": "og:description", "content": "Votre dossier de crédit est en cours d'étude. Réponse de principe sous 24h.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary", "is_url": false },
      { "name": "twitter:title", "content": "Votre demande a bien été enregistrée", "is_url": false }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "produit_auto_moto": {
    "meta": [
      { "name": "description", "content": "Simulez votre prêt auto ou moto en ligne : mensualités adaptées, TAEG fixe, réponse de principe sous 24h. Financez votre véhicule neuf ou d'occasion." },
      { "name": "keywords", "content": "prêt auto, crédit moto, financement véhicule, simulation prêt auto" },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Prêt Auto & Moto — Simulez votre crédit véhicule", "is_url": false },
      { "property": "og:description", "content": "Financez votre auto ou moto avec un crédit à la consommation adapté à votre budget.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/pret-auto-moto.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Prêt Auto & Moto — Simulez votre crédit véhicule", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/pret-auto-moto.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "produit_regroupement_credits": {
    "meta": [
      { "name": "description", "content": "Regroupez vos crédits en une seule mensualité et réduisez vos charges. Simulation gratuite et sans engagement de votre rachat de crédits." },
      { "name": "keywords", "content": "rachat de crédits, regroupement de crédits, simulation rachat de crédit" },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Rachat de Crédits — Simplifiez vos remboursements", "is_url": false },
      { "property": "og:description", "content": "Regroupez l'ensemble de vos crédits en une mensualité unique et allégez votre budget.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/rachat-de-credits.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Rachat de Crédits — Simplifiez vos remboursements", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/rachat-de-credits.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "produit_travaux": {
    "meta": [
      { "name": "description", "content": "Financez vos travaux de rénovation ou d'aménagement avec un crédit travaux flexible. Simulation immédiate de votre mensualité." },
      { "name": "keywords", "content": "prêt travaux, crédit rénovation, financement travaux maison" },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Prêt Travaux — Financez vos projets de rénovation", "is_url": false },
      { "property": "og:description", "content": "Un crédit dédié pour financer vos travaux d'aménagement ou de rénovation.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/pret-travaux.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Prêt Travaux — Financez vos projets de rénovation", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/pret-travaux.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "produit_personnel": {
    "meta": [
      { "name": "description", "content": "Un projet personnel à financer ? Simulez votre prêt personnel en ligne, sans justificatif d'achat, avec une réponse rapide." },
      { "name": "keywords", "content": "prêt personnel, crédit personnel, financement libre" },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Prêt Personnel — Financez librement votre projet", "is_url": false },
      { "property": "og:description", "content": "Un crédit personnel sans justificatif pour financer le projet de votre choix.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/pret-personnel.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Prêt Personnel — Financez librement votre projet", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/pret-personnel.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  },

  "produit_famille_loisirs": {
    "meta": [
      { "name": "description", "content": "Vacances, mariage, événement familial : financez vos projets loisirs avec un crédit adapté et une simulation immédiate." },
      { "name": "keywords", "content": "prêt loisirs, crédit vacances, financement mariage, crédit famille" },
      { "name": "robots", "content": "index, follow" }
    ],
    "og": [
      { "property": "og:type", "content": "website", "is_url": false },
      { "property": "og:title", "content": "Prêt Famille & Loisirs — Financez vos projets du quotidien", "is_url": false },
      { "property": "og:description", "content": "Un crédit dédié à vos projets familiaux et loisirs : vacances, mariage, événements.", "is_url": false },
      { "property": "og:locale", "content": "fr_FR", "is_url": false },
      { "property": "og:url", "content": "", "is_url": true, "url_type": "current" },
      { "property": "og:image", "content": "/images/og/pret-famille-loisirs.jpg", "is_url": true, "url_type": "asset" }
    ],
    "twitter": [
      { "name": "twitter:card", "content": "summary_large_image", "is_url": false },
      { "name": "twitter:title", "content": "Prêt Famille & Loisirs — Financez vos projets du quotidien", "is_url": false },
      { "name": "twitter:image", "content": "/images/og/pret-famille-loisirs.jpg", "is_url": true, "url_type": "asset" }
    ],
    "links": [
      { "rel": "canonical", "is_url": true, "url_type": "current" }
    ]
  }
}
```

> Adapter/compléter les textes si besoin, mais **ne pas changer la structure** (clés `meta`/`og`/`twitter`/`links`, forme `{ name|property|rel, content, is_url, url_type }`).

---

## 2. Résolution backend — `App\Services\SeoService`

Créer un service Laravel qui :

1. Charge `resources/data/seo.json` (mise en cache via `Cache::rememberForever('seo.json', ...)`, invalidée en dev)
2. Expose une méthode `for(string $pageKey): array` qui :
   - Récupère le bloc correspondant à `$pageKey` (ex. `homepage`, `produit_travaux`)
   - Résout tous les placeholders `{{ VARIABLE }}` en lisant `config()`/`env()` (ex. `{{ APP_NAME }}` → `config('app.name')`, `{{ GOOGLE_SITE_VERIFICATION }}` → `config('services.seo.google_site_verification')`, `{{ THEME_COLOR }}` → une constante du Design System)
   - Résout chaque entrée `is_url: true` :
     - `url_type: "current"` → `request()->fullUrl()` (sans les query strings de tracking, à normaliser)
     - `url_type: "asset"` → `asset($content)` (URL absolue)
   - Retourne un tableau normalisé prêt à être sérialisé en props Inertia
3. Lève une exception explicite si `$pageKey` n'existe pas dans le JSON (fail-fast en dev, log + fallback générique en prod)

Chaque contrôleur de page doit appeler ce service et passer le résultat en prop Inertia, ex. :

```php
return Inertia::render('Pages/Home', [
    'seo' => $this->seoService->for('homepage'),
    // ...autres props
]);
```

---

## 3. Rendu frontend — composant `Seo.tsx`

Créer `src/components/Common/Seo.tsx` :
- Reçoit en prop la structure normalisée renvoyée par `SeoService::for()`
- Utilise `<Head>` de `@inertiajs/react`
- Rend dynamiquement :
  - Le `<title>` à partir de `og:title` (ou d'une prop `title` dédiée si vous préférez la séparer du JSON)
  - Toutes les entrées `meta[]` → `<meta name={...} content={...} />`
  - Toutes les entrées `og[]` → `<meta property={...} content={...} />`
  - Toutes les entrées `twitter[]` → `<meta name={...} content={...} />`
  - Toutes les entrées `links[]` → `<link rel={...} href={...} />`
- Ce composant est appelé **une seule fois par page**, en tout début de chaque composant `Pages/*.tsx`, avec la prop `seo` reçue depuis Inertia — aucune autre balise SEO ne doit être écrite ailleurs dans le code

---

## Contraintes de sortie

- Ne jamais coder de `<title>`/`<meta>` en dur dans un composant de page : tout passe par `seo.json` + `SeoService` + `<Seo />`
- Les 9 pages du site (cf. prompt "Pages Web") doivent chacune avoir leur entrée dans `seo.json` et appeler `<Seo seo={...} />`
- Si une clé est absente du JSON pour une page donnée, ne pas planter le rendu : log un warning et afficher un fallback minimal (title générique du site)
- Livrer un récapitulatif final : fichiers créés/modifiés (JSON, service, composant, contrôleurs mis à jour)
