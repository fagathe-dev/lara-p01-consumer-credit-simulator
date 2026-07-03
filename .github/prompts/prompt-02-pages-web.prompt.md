# Prompt — Génération des Pages Web (Routes, Contenu, Maillage Interne SEO)

## Contexte

Projet Laravel 13 + Inertia.js + React/TypeScript (styled-components), clone de simulateur de crédit B2C.
Le site vitrine doit acquérir du trafic (SEO) et convertir un maximum de visiteurs vers le tunnel de demande de crédit.

**Règle produit non négociable** : le tunnel de simulation est LE produit vendu. Chaque page publique du site, sans exception, doit contenir au moins un (idéalement plusieurs) appel à l'action visible et cliquable vers le tunnel, avec un ancre-texte varié et contextualisé (pas toujours le même texte, pour le maillage interne SEO).

> **Prérequis / dépendances** : ce prompt suppose que l'UI Kit (`resources/js/ui/`, cf. `ui-kit.md`), les design tokens (`resources/js/ui/theme/`, valeurs issues de `DESIGN_SYSTEM.md`) et les layouts (`resources/js/ui/Layouts/`) existent déjà. La gestion SEO est déléguée au système `data/seo.json` + `SeoService` + composant `<Seo />` (prompt SEO dédié) : **ne pas coder de balises `<title>`/`<meta>` en dur ici**.

## Objectif

Créer **9 pages web visibles** (routes Laravel + composants Inertia/React), avec leur contenu HTML/JSX, en respectant l'organisation front cible :
- Pages dans `resources/js/Pages/<Domaine>/`
- Layouts consommés depuis `resources/js/ui/Layouts/`
- Composants d'UI consommés depuis `resources/js/ui/components/<Catégorie>/`

---

## 1. Liste des routes à créer

| # | Route | Composant (dossier `Pages/`) | Rôle |
|---|---|---|---|
| 1 | `/` | `Pages/Guest/Home` | Landing page principale, conversion |
| 2 | `/mentions-legales` | `Pages/Guest/MentionsLegales` | Page légale/RGPD obligatoire |
| 3 | `/simulation/credit-consommation/` | `Pages/Simulation/Tunnel` | Entrée du tunnel multi-étapes |
| 4 | `/simulation/credit-consommation/resultat` | `Pages/Simulation/Resultat` | Écran de résultat / confirmation post-soumission |
| 5 | `/pret-auto-moto` | `Pages/Guest/Produits/AutoMoto` | SEO, `ProjectTypeEnum::AUTO_MOTO` |
| 6 | `/rachat-de-credits` | `Pages/Guest/Produits/RachatCredits` | SEO, `ProjectTypeEnum::REGROUPEMENT_CREDITS` |
| 7 | `/pret-travaux` | `Pages/Guest/Produits/Travaux` | SEO, `ProjectTypeEnum::TRAVAUX` |
| 8 | `/pret-personnel` | `Pages/Guest/Produits/Personnel` | SEO, `ProjectTypeEnum::AUTRE` |
| 9 | `/pret-famille-loisirs` | `Pages/Guest/Produits/FamilleLoisirs` | SEO, `ProjectTypeEnum::FAMILLE_LOISIR` |

Déclarer ces routes dans `routes/web.php` (routes GET publiques, hors middleware auth). Chaque contrôleur passe en prop Inertia les données SEO résolues via `SeoService::for('<clé_page>')` (cf. prompt SEO) et rend le composant `Pages/<Domaine>/*` correspondant.

---

## 2. Composant transverse : `TunnelCTA`

`TunnelCTA` est un composant **métier** (il connaît l'URL du tunnel, c'est le produit vendu) : il ne va donc **pas** dans l'UI Kit générique `ui/` (qui doit rester agnostique du domaine), mais dans un dossier de composants applicatifs, ex. `resources/js/components/TunnelCTA/`. Il est **construit par-dessus** le `Button` de l'UI Kit (`@/ui/components/Base/Button`), il ne réimplémente pas un bouton.

- Props : `variant` (`hero` | `inline` | `sticky` | `footer`), `label` (texte personnalisable par page), `href` (défaut `/simulation/credit-consommation/`)
- Pointe toujours vers le tunnel, jamais vers une ancre morte
- Style fortement contrasté (couleur `brand.primary` des tokens), variante `hero` visible sans scroll
- Variante `sticky` : bandeau CTA collant en bas de viewport sur mobile, intégré dans `AppLayout`, présent sur toutes les pages publiques

Chaque page publique utilise ce composant **au moins 2 fois** (ex. `hero` en haut + `inline` en fin de contenu), avec un `label` différent à chaque emplacement pour varier les ancres internes.

---

## 3. Contenu attendu par page

### Page 1 — Accueil (`Pages/Guest/Home`, `/`)
- Hero : accroche commerciale + réassurance (sécurité, rapidité) + 1er `TunnelCTA` (`hero`, ex. "Simuler mon crédit en 2 minutes")
- Section réassurance (organisme, sécurité des données, délai de réponse 24h)
- Section "Nos types de financement" : grille de 5 cartes (composant `Card` de l'UI Kit), une par type de projet, chaque carte liant vers sa page produit dédiée (liens internes vers pages 5 à 9)
- Section FAQ courte (3-4 questions), via l'`Accordion` de l'UI Kit (`@/ui/components/Widgets/Accordion`)
- 2e `TunnelCTA` (`inline`, ex. "Démarrer ma demande")
- Lien vers `/mentions-legales` (assuré par le footer de `AppLayout`)

### Page 2 — Mentions Légales (`Pages/Guest/MentionsLegales`, `/mentions-legales`)
- Contenu obligatoire secteur financier : éditeur, hébergeur, TAEG fixe, mention réglementaire "Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.", politique de confidentialité RGPD (finalités, base légale, durée de conservation, droits d'accès/rectification)
- Malgré la nature légale, inclure 1 `TunnelCTA` discret (`inline`) en bas de page — ne jamais casser le maillage
- Texte long : utiliser `Text`/`Title` de l'UI Kit avec `lineHeight` relaxed

### Page 3 — Tunnel Étape 1 (`Pages/Simulation/Tunnel`, `/simulation/credit-consommation/`)
- Monte le moteur de tunnel (`@/core/tunnel`) et rend l'étape courante ; Étape 1 = Projet (type, montant, durée)
- Header de progression via le composant `Progress` de l'UI Kit (`@/ui/components/Navigation/Progress` → `ProgressSteps` + `ProgressBar`), branché sur `TUNNEL_STEPS`/`currentStep`/`progressPercent` du moteur
- **Seule page où l'on NE multiplie PAS les CTA externes** : pas de liens sortants qui détournent de la conversion, l'objectif est de terminer le tunnel. Utiliser un layout allégé (voir §4)

### Page 4 — Résultat (`Pages/Simulation/Resultat`, `/simulation/credit-consommation/resultat`)
- **Accès conditionnel** : la page n'est accessible qu'après soumission d'un dossier (état en session). Sinon, redirection vers `/simulation/credit-consommation/` ou `/`. Cohérent avec le `noindex` SEO de cette page
- Écran de confirmation : accusé de réception, délai de réponse (24h), prochaines étapes
- Si un scoring/matrice d'offres est disponible (cf. `features.md` §4.B), afficher les 3 offres (Courte / Équilibrée / Souple) via des `Card` ; sinon état "Votre dossier est en cours d'étude". Rappel : ces données viennent de Laravel (asynchrone), le front n'interroge jamais l'API Python
- 1 `TunnelCTA` "Faire une nouvelle simulation" (`inline`) pour relancer une simulation

### Pages 5 à 9 — Pages Produit (`Pages/Guest/Produits/*`, une par `ProjectTypeEnum`)
Structure identique, contenu spécifique à chaque type de projet :
- Titre H1 SEO (ex. "Prêt Auto & Moto : simulez votre crédit en ligne")
- Bloc explicatif : spécificités (montants typiques, durées possibles parmi `project_duration`, ce que couvre ce type de projet)
- 1er `TunnelCTA` (`hero`) au label contextualisé (ex. "Simuler mon prêt auto", "Simuler mon rachat de crédits")
- Bloc réassurance réutilisé (même composant que l'accueil)
- Liens croisés vers les 4 autres pages produit ("Vous cherchez plutôt un prêt travaux ? →") pour le maillage interne
- 2e `TunnelCTA` (`inline`) en fin de page

---

## 4. Layouts

- Pages publiques (1, 2, 5-9) → `AppLayout` (`@/ui/Layouts/AppLayout`) : header avec logo + `TunnelCTA` `sticky`, footer commun (liens `/mentions-legales`, `/`, et les 5 pages produit)
- Page Tunnel (3) → layout allégé : soit une variante `AppLayout` sans header CTA distrayant, soit un layout dédié minimal. Pas de navigation sortante, focus sur la complétion
- Page Résultat (4) → layout allégé également, mais avec le CTA de relance autorisé

---

## Contraintes de sortie

- Respecter le Design System via les tokens (`@/ui/theme`), valeurs faisant foi dans `DESIGN_SYSTEM.md` ; aucune couleur/typo en dur
- Aucune balise SEO en dur : chaque page appelle `<Seo seo={seo} />` (prop Inertia issue de `SeoService`) — cf. prompt SEO
- Aucun framework CSS utilitaire (pas de Tailwind), uniquement `styled-components` (cf. `architecture.md`)
- Consommer les composants via leur `index.ts` de dossier (`@/ui/components/<Catégorie>/<Composant>`), jamais un fichier interne
- Thème clair unique, pas de mode sombre
- Chaque page = composant TypeScript strict, sans `any`
- Livrer un récapitulatif final : routes déclarées + fichiers composants créés (avec leurs chemins sous `resources/js/Pages/`)
