# Prompt — Design System : Design Tokens, Composants UI & Layouts

## Contexte & Direction Artistique

Application financière (simulateur de crédit + CRM conseiller). L'interface doit être **premium mais sobre, minimaliste sans être vide**.

**Important — pas de mode sombre.** Cette application est un outil financier sérieux (simulation de crédit, CRM d'analystes), pas une application grand public/réseau social. Un seul thème clair, fixe, sans bascule. Ne pas implémenter :
- de détection `prefers-color-scheme`
- de toggle clair/sombre dans l'UI
- de variante `darkColors`/`darkTheme` dans les tokens
Le token `background.inverse` (voir ci-dessous) n'est **pas** un mode sombre — c'est juste une couleur de fond foncée ponctuelle pour un élément isolé (tooltip, footer), l'interface générale reste toujours claire.

Précision importante sur "minimaliste" : cela ne veut **pas** dire afficher peu d'informations. Un dossier de crédit a beaucoup de données (revenus, charges, scoring, offres). Minimaliste signifie ici :
- Afficher exactement ce qu'il faut, **au bon endroit et au bon moment** (hiérarchie visuelle claire, progressive disclosure déjà prévue dans le tunnel)
- Aucune surcharge décorative : pas de gradients tape-à-l'œil, pas d'animations gratuites, pas d'ombres épaisses
- Chaque élément (couleur, ombre, radius) a une fonction, jamais une fonction purement esthétique
- Beaucoup de respiration (whitespace), une seule couleur d'accent forte (le mauve), tout le reste en neutres

**Inspiration** (uniquement le *look* : densité d'information, radius, ombres douces, badges/pills, structure de cartes) — jamais le code ni les classes Tailwind, puisque le projet utilise `styled-components` sans Tailwind (cf. `architecture.md`) :
- [Flowbite](https://flowbite.com/docs/components/accordion/) — pour la structure des composants (accordion, badges, alerts)
- [FlyonUI](https://flyonui.com/docs/component/?theme=light) — pour la densité et les states (hover/focus/disabled)
- [HyperUI](https://hyperui.dev/) — pour les compositions de cards et layouts marketing

Traduire ces inspirations en **valeurs de tokens** et en **props de composants styled-components**, jamais en classes utilitaires.

---

## 1. Design Tokens — `resources/js/theme/`

Créer les fichiers suivants (TypeScript, typés, sans `any`) :

### 1.1 `colors.ts`

#### Palette Primary — Mauve
Échelle 50→950 dans l'esprit [uicolors.app](https://uicolors.app/tailwind-colors) (échelle perceptuellement homogène). Base proposée (à affiner sur l'outil si besoin, en réinjectant la valeur `500` comme graine) :

```typescript
export const mauve = {
  50:  '#FAF8FA',
  100: '#F3EFF3',
  200: '#E6DEE6',
  300: '#D1C0D1',
  400: '#B597B6',
  500: '#966F97', // couleur primary de référence
  600: '#7A5A7C',
  700: '#614763',
  800: '#4C384E',
  900: '#3A2C3C',
  950: '#241B26',
} as const;
```

> Volontairement désaturé (mauve "poussiéreux", pas violet vif) pour rester sobre/premium et éviter un rendu criard sur une interface financière.

#### Palette Secondary — Slate
Échelle standard slate (neutre à dominante bleu-gris, pour textes/bordures/fonds) :

```typescript
export const slate = {
  50:  '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
} as const;
```

#### Couleurs de statut
Reprendre les échelles habituelles (au moins les nuances 50, 100, 500, 600, 700, 900 de chaque, pour couvrir fond léger / fond badge / texte / bordure / hover / texte foncé) :

```typescript
export const success = { 50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E', 600: '#16A34A', 700: '#15803D', 900: '#14532D' } as const;
export const warning = { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 900: '#78350F' } as const;
export const danger  = { 50: '#FEF2F2', 100: '#FEE2E2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 900: '#7F1D1D' } as const;
export const info    = { 50: '#F0F9FF', 100: '#E0F2FE', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 900: '#0C4A6E' } as const;
```

#### Tokens sémantiques (ce que les composants doivent réellement consommer)

Ne jamais utiliser `mauve[500]` directement dans un composant : passer par une couche sémantique, pour pouvoir faire évoluer la palette sans tout réécrire :

```typescript
export const semanticColors = {
  background: {
    app: slate[50],        // fond général de l'application
    surface: '#FFFFFF',    // fond des cards/panels
    subtle: slate[100],    // fond des zones secondaires (sidebar, sections alternées)
    inverse: slate[900],   // fond sombre (ex. tooltip, footer)
  },
  border: {
    default: slate[200],
    strong: slate[300],
    focus: mauve[400],
  },
  text: {
    primary: slate[900],
    secondary: slate[600],
    muted: slate[400],
    onPrimary: '#FFFFFF',   // texte sur fond mauve[500..700]
    link: mauve[600],
  },
  brand: {
    primary: mauve[500],
    primaryHover: mauve[600],
    primaryActive: mauve[700],
    primarySubtle: mauve[50],   // fond léger (ex. badge "actif")
    secondary: slate[600],
    secondaryHover: slate[700],
  },
  status: {
    success: { bg: success[50], text: success[700], border: success[100], solid: success[500] },
    warning: { bg: warning[50], text: warning[700], border: warning[100], solid: warning[500] },
    danger:  { bg: danger[50],  text: danger[700],  border: danger[100],  solid: danger[500] },
    info:    { bg: info[50],    text: info[700],    border: info[100],    solid: info[500] },
  },
} as const;
```

> Faire le lien explicite avec `ApplicationStatusEnum::color()` (backend) : `new` → `info`, `in_progress` → `warning`, `accepte` → `success`, `refused` → `danger`. Le badge de statut du CRM doit consommer ces tokens `status.*`, pas des couleurs en dur.

### 1.2 `typography.ts`

- Police d'interface unique pour toute l'application (dashboard + tunnel + site vitrine) : **Inter** (variable font), pour la lisibilité des données financières et la cohérence avec l'esthétique Flowbite/FlyonUI/HyperUI qui utilisent toutes des polices géométriques neutres du même esprit
- Une police utilitaire à chiffres tabulaires (`font-variant-numeric: tabular-nums`) pour tous les montants (mensualités, revenus, charges) — évite que les colonnes de chiffres "dansent" dans les tableaux du CRM
- Échelle de tailles (rem, base 16px) : `xs (12px)`, `sm (14px)`, `base (16px)`, `lg (18px)`, `xl (20px)`, `2xl (24px)`, `3xl (30px)`, `4xl (36px)`, `5xl (48px)`
- Poids : `regular (400)`, `medium (500)`, `semibold (600)`, `bold (700)` — pas de `black`/`900`, ça casserait le côté sobre
- `lineHeight` : `tight (1.2)` pour les titres, `normal (1.5)` pour le corps de texte, `relaxed (1.75)` pour les paragraphes longs (mentions légales)

```typescript
export const typography = {
  fontFamily: {
    base: "'Inter', system-ui, -apple-system, sans-serif",
    tabular: "'Inter', system-ui, sans-serif", // + fontVariantNumeric: 'tabular-nums' appliqué via mixin
  },
  fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem' },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
} as const;
```

### 1.3 `spacing.ts`

Grille de base 4px (cohérente avec l'esprit Tailwind/Flowbite, sans dépendre de Tailwind) :

```typescript
export const spacing = {
  0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
  5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem', 12: '3rem',
  16: '4rem', 20: '5rem', 24: '6rem', 32: '8rem',
} as const;
```

### 1.4 `radius.ts` / `shadows.ts`

Radius et ombres **discrets**, pas de card flottante façon Material :

```typescript
export const radius = { sm: '6px', md: '8px', lg: '12px', xl: '16px', full: '9999px' } as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  md: '0 2px 8px -2px rgba(15, 23, 42, 0.08)',
  lg: '0 8px 24px -4px rgba(15, 23, 42, 0.10)',
} as const;
```

### 1.5 `index.ts`

Assembler l'objet `theme` final et déclarer le module augmentation TypeScript pour `styled-components` (`DefaultTheme`) afin d'avoir l'autocomplétion `theme.colors...`, `theme.spacing...` dans tous les composants :

```typescript
import { mauve, slate, success, warning, danger, info, semanticColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors: { mauve, slate, success, warning, danger, info, ...semanticColors },
  typography,
  spacing,
  radius,
  shadows,
};

export type AppTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
```

Créer aussi `GlobalStyle.tsx` (déjà prévu dans `architecture.md`) : reset CSS minimal, `font-family` de base, couleur de fond `theme.colors.background.app`, focus visible clavier (accessibilité — ne jamais supprimer `outline` sans le remplacer par un style de focus visible en `border.focus`).

---

## 2. Composants UI de base — `resources/js/components/Common/`

Pour chaque composant : styled-components, props typées strictement (`variant`, `size`, `disabled`, etc.), pas de style en dur hors tokens. États obligatoires : `default`, `hover`, `focus-visible`, `active`, `disabled`, et `loading` quand pertinent.

| Composant | Variants attendus | Notes |
|---|---|---|
| `Button` | `primary`, `secondary`, `outline`, `ghost`, `danger` × tailles `sm`/`md`/`lg` | Version `isLoading` avec spinner inline, jamais de changement de taille du bouton pendant le chargement |
| `Badge` | `status` (consomme `theme.colors.status.*` — pour `ApplicationStatusEnum`) **et** `custom` (accepte une couleur hex libre — pour les tags CRM façon "Apple Finder" de `features.md`) | Le composant doit supporter les deux modes sans dupliquer la logique |
| `Col` / `Row` / `Grid` | Système de colonnes basé sur CSS Grid/Flexbox, props `span`, `gap`, `align`, `justify` | Pas de grid 12 colonnes façon Bootstrap si non nécessaire — rester simple, responsive par breakpoints (`sm`, `md`, `lg`, `xl`) |
| `Card` | `default`, `bordered`, `elevated` (utilise `shadows.md`) | Header/Body/Footer optionnels en sous-composants (`Card.Header`, `Card.Body`) |
| `Input` / `MoneyInput` / `Select` | états `error`, `disabled`, `readOnly` | `MoneyInput` déjà spécifié dans `architecture.md` — l'aligner sur ces tokens |
| `Alert` | `success`, `warning`, `danger`, `info` | Utilisé pour les messages de validation Form Request et les confirmations |
| `Table` | Colonnes triables, ligne hover, cellules à chiffres alignés à droite avec police tabulaire | Base du futur tableau CRM |
| `Tabs` | `default`, `pills` | Pour la fiche dossier (Vue 360°, Scoring, Offres) |
| `Modal` / `Dialog` | Overlay + focus trap | Pour les actions manuelles conseiller (forcer statut, ajouter note) |
| `Dropdown` / `Menu` | Positionnement automatique | Pour les filtres CRM et les actions rapides |
| `Checkbox` / `Radio` / `Switch` | états `checked`, `indeterminate`, `disabled` | Pour les consentements RGPD du tunnel |
| `Tooltip` | Délai d'apparition raisonnable (~300ms), jamais instantané | Pour les info-bulles d'aide sur les champs financiers complexes |
| `Avatar` | Initiales de fallback si pas d'image | Pour le conseiller connecté dans le CRM |
| `Divider` | Horizontal/vertical | Séparation sobre entre sections |
| `Skeleton` | Formes `text`, `circle`, `rect` | Chargement des données du CRM sans spinner plein écran |
| `Pagination` | Compacte | Pour les listes de dossiers |

> Ne pas ajouter de composants non listés ici sans nécessité identifiée — rester minimaliste dans le kit lui-même.

---

## 3. Layouts — `resources/js/components/Layout/`

### `AuthLayout`
- Utilisé pour la page de connexion conseiller (`LoginPage.tsx`)
- Composition centrée, carte unique sur fond `background.app`, logo en haut, aucun élément de navigation (on ne veut pas qu'un visiteur non connecté puisse naviguer ailleurs depuis cet écran)
- Pas de sidebar, pas de header — sobriété maximale, l'attention doit rester sur le formulaire de connexion

### `AppLayout`
- Layout du site public (site vitrine + tunnel), englobe `GuestLayout` déjà prévu dans `architecture.md`
- Header avec logo + `TunnelCTA` sticky (cf. prompt "Pages Web")
- Footer commun (mentions légales, liens pages produit)
- Pas de sidebar

### `DashboardLayout`
- Layout du CRM conseiller, utilisé par toutes les pages `Pages/Crm*`
- Sidebar fixe à gauche (navigation : Pipeline, Recherche, Paramètres/Tags, Déconnexion), largeur fixe raisonnable (pas de sidebar qui prend 30% de l'écran)
- Header supérieur : nom du conseiller connecté (`Avatar` + nom), fil d'Ariane contextuel
- Zone de contenu principale avec padding cohérent (`spacing[6]` ou `spacing[8]`), fond `background.subtle` pour bien détacher les `Card` blanches (`background.surface`) posées dessus
- Responsive : sidebar repliable en drawer sur mobile/tablette (le CRM sera surtout utilisé desktop, mais ne doit pas casser sur petit écran)

---

## Principes directeurs à respecter pendant l'implémentation

- Une seule couleur d'accent forte (mauve) — le slate et le blanc font tout le reste du travail
- Aucune animation qui n'a pas de fonction (pas de fade-in décoratif sur scroll, pas de parallax) — seules les micro-interactions fonctionnelles sont permises (transition de couleur au hover ~150ms, apparition de tooltip, transition d'ouverture de modal)
- Contraste AA minimum (WCAG) sur tous les textes, en particulier `text.muted` sur `background.surface`
- Focus clavier toujours visible (`border.focus`), jamais supprimé
- Densité d'information élevée mais aérée : s'inspirer de la compacité de Flowbite/FlyonUI plutôt que du confort excessif de certains dashboards SaaS trop spacés
- Thème unique clair, fixe — aucune logique de dark mode, aucun toggle, aucune détection système

## Contraintes de sortie

- Aucune classe Tailwind, aucun import de framework CSS utilitaire — uniquement `styled-components` consommant les tokens ci-dessus via `theme`
- Tous les fichiers `theme/*.ts` exportent des objets `as const` pour l'inférence stricte des types
- Chaque composant doit avoir ses props exportées (`ButtonProps`, `BadgeProps`, etc.) pour être réutilisables et testables
- Livrer un récapitulatif final : fichiers de tokens créés, liste des composants créés avec leurs variants, layouts créés
