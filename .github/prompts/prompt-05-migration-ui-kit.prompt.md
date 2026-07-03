# Prompt — Migration vers la nouvelle structure UI Kit (`resources/js/ui/`)

## Contexte

La vision de l'UI Kit a évolué (cf. `ui-kit.md` à la racine du projet) : passage d'une organisation plate (`components/Common`, `components/Layout`, `theme/*`) à une organisation **par catégorie fonctionnelle** sous `resources/js/ui/`, avec une convention stricte d'export (un dossier par composant, `index.ts` qui ré-exporte le composant et ses variantes).

Le projet possède déjà du code généré selon l'ancienne organisation (tokens, quelques composants de base, layouts). Il possède aussi un fichier `DESIGN_SYSTEM.md` à la racine, qui documente les variables de tokens actuellement en usage (`primary`, `secondary`, `shadow`, etc.) — **ce fichier est la source de vérité actuelle des valeurs de tokens**, à ne pas réinventer, seulement à migrer vers le nouvel emplacement.

Ce prompt a deux objectifs :
1. **Migrer la structure existante** vers l'organisation cible (`ui-kit.md`), en décidant pour chaque fichier existant s'il est déplacé/adapté ou supprimé et régénéré
2. **Compléter le kit** avec les composants manquants identifiés : `SelectableCard`, `SelectableAutocomplete`, `Progress`

---

## 1. Arborescence cible

```text
resources/js/
├── ui/
│   ├── theme/
│   │   ├── index.ts          # point d'entrée unique — ré-exporte tout
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── radius.ts
│   │   └── shadows.ts
│   │
│   ├── components/
│   │   ├── Base/              # Button, Badge, Icon, Spinner, Divider
│   │   ├── Typography/        # Text, Title, Link, Code, Label
│   │   ├── Forms/             # Input, Select, Checkbox, Radio, Switch, Field,
│   │   │                      # FieldLabel, FieldError, SelectableCard,
│   │   │                      # SelectableAutocomplete, FormGroup
│   │   ├── Layout/            # Container, Grid, Row, Col, Stack, Flex, Spacer
│   │   ├── Table/             # Table, TableHead, TableBody, TableRow, TableCell, EmptyState
│   │   ├── Media/              # Image, Figure, Avatar, Icon
│   │   ├── Feedback/          # Alert, Toast, Progress, Skeleton, Loader
│   │   ├── Navigation/        # Tabs, Breadcrumb, Pagination, Menu, Progress
│   │   └── Widgets/           # Card, Modal, Drawer, Accordion, Tooltip, Popover
│   │
│   └── Layouts/
│       ├── AppLayout/
│       ├── AuthLayout/
│       ├── ErrorLayout/       # nouveau — pages d'erreur (404, 500, 403)
│       └── DashboardLayout/
│
└── Pages/
    ├── Guest/                 # Accueil, pages produit, mentions légales
    ├── Simulation/             # Tunnel étape 1, Résultat
    ├── Auth/                  # Login conseiller
    ├── Crm/                   # Pipeline, fiche dossier, paramètres/tags
    └── Errors/                # 404, 500, etc. (utilisent ErrorLayout)
```

> Remarque sur `Progress` : ce composant a une double nature (indicateur de navigation ET feedback de progression), voir §4.3 — le placer dans `Navigation/` (c'est son usage principal dans le tunnel) et ne pas le dupliquer dans `Feedback/`.

Chaque composant respecte strictement la convention de `ui-kit.md` :
```text
Base/Button/
├── Button.tsx
├── OutlineButton.tsx
├── GhostButton.tsx
└── index.ts
```

---

## 2. Phase 1 — Audit de l'existant

Avant toute création, **lister tous les fichiers existants** sous les anciens emplacements probables :
- `resources/js/theme/*`
- `resources/js/components/Common/*`
- `resources/js/components/Layout/*`
- tout fichier de page déjà créé (accueil, mentions légales, tunnel, pages produit)

Pour chaque fichier trouvé, décider selon cette grille :

| Cas | Décision |
|---|---|
| Tokens (`colors.ts`, `typography.ts`, etc.) déjà alignés avec `DESIGN_SYSTEM.md` | **Déplacer** vers `resources/js/ui/theme/`, adapter uniquement les chemins d'import |
| Tokens qui divergent de `DESIGN_SYSTEM.md` (valeurs différentes) | `DESIGN_SYSTEM.md` fait autorité : **régénérer** le fichier avec les valeurs du markdown, ne pas garder l'ancienne valeur |
| Composant de base simple (`Button`, `Badge`, `Divider`, etc.) dont l'API (props) reste valable | **Déplacer** dans son nouveau dossier catégorisé + créer son `index.ts` conforme à la convention |
| Composant dont la structure de fichier ne respecte pas la convention "un dossier par composant avec `index.ts`" | **Régénérer** dans le nouveau format, en conservant la logique/props existantes si elles sont correctes |
| Layout (`AppLayout`, `AuthLayout`, `DashboardLayout`) | **Déplacer** vers `resources/js/ui/Layouts/<Nom>/`, adapter les imports vers `@/ui/...` |
| Pages déjà écrites (Accueil, Mentions légales, pages produit, tunnel) | **Déplacer** vers `resources/js/Pages/<Domaine>/`, mettre à jour les imports de layouts/composants |
| Fichier orphelin, doublon, ou non conforme à `ui-kit.md` sans logique récupérable | **Supprimer** et régénérer proprement depuis zéro |

Ne rien déplacer sans avoir vérifié que le contenu du fichier est toujours pertinent — en cas de doute, préférer la régénération propre à un déplacement approximatif.

---

## 3. Phase 2 — Migration des tokens depuis `DESIGN_SYSTEM.md`

- Lire `DESIGN_SYSTEM.md` à la racine du projet : c'est la référence actuelle des valeurs (`primary`, `secondary`, couleurs de statut, `shadow`, espacements, etc.)
- Reconstituer `resources/js/ui/theme/{colors,typography,spacing,radius,shadows}.ts` à partir de ces valeurs exactes (ne pas réinventer de nouvelles valeurs, ne pas revenir à d'anciennes valeurs d'un prompt précédent si elles diffèrent de `DESIGN_SYSTEM.md`)
- `resources/js/ui/theme/index.ts` reste le point d'entrée unique qui assemble l'objet `theme` et déclare l'augmentation de module `styled-components` (`DefaultTheme`)
- Rappel : thème unique clair, pas de mode sombre (toujours valable)

---

## 4. Phase 3 — Composants manquants

### 4.1 `Forms/SelectableCard`

Carte/ligne cliquable pour un choix unique ou multiple dans un formulaire (ex. type de projet dans le tunnel). D'après les captures fournies, prévoir **deux variantes** dans le même dossier (`SelectableCard.tsx` + `SelectableCardList.tsx`, ré-exportées via `index.ts`) :

- **Variante `card`** (grille avec icône) : icône en haut, label en dessous, centré, bordure fine au repos ; à la sélection, fond plein coloré (`theme.colors.brand.primary`), icône et texte passent en `text.onPrimary`
- **Variante `list`** (liste verticale sans icône) : ligne pleine largeur, bordure arrondie, chevron/flèche à gauche, label centré ou aligné à gauche ; à la sélection, même traitement (fond plein ou bordure renforcée + coche)

Props communes : `selected: boolean`, `onSelect: () => void`, `label: string`, `icon?: ReactNode` (variante `card` uniquement), `disabled?: boolean`. Le composant doit être utilisable en groupe contrôlé (le parent gère quelle carte est sélectionnée), pas de state interne persistant.

> Ne pas reproduire l'indicateur de curseur/pourcentage visible sous les cartes dans la capture (Image 2) — cet élément appartient à un composant de type slider, hors périmètre : le projet exclut explicitement les sliders pour la saisie de données financières (cf. `features.md`, on garde des inputs numériques avec masque monétaire). Cette capture sert uniquement de référence visuelle pour les cartes elles-mêmes.

### 4.2 `Forms/SelectableAutocomplete`

Équivalent "select2" en React, sans dépendance externe (`react-select`, `downshift`, etc. sont exclus — cohérence avec l'approche `styled-components` pure déjà retenue). D'après la capture (Image 4) :

- Un `Input` texte avec label (ex. "Ville ou code postal")
- Une liste déroulante qui apparaît sous le champ dès que l'utilisateur tape, avec :
  - Un en-tête de section (ex. "Sélectionnez votre ville :") — prop `sectionLabel?: string`
  - La liste des résultats filtrés, chaque option cliquable (au clic : remplit le champ, ferme la liste)
- Navigation clavier complète : `↓`/`↑` pour parcourir les options, `Entrée` pour valider, `Échap` pour fermer — respecter le pattern ARIA `combobox`
- Props : `value`, `onChange`, `options: { label: string; value: string }[]` **ou** `onSearch: (query: string) => Promise<Option[]>` pour un usage asynchrone (utile pour une recherche de ville par code postal côté API), `sectionLabel?`, `noResultsLabel?`, `placeholder?`

### 4.3 `Navigation/Progress`

D'après la capture (Image 3), ce composant regroupe **deux éléments visuels utilisés ensemble** dans le header du tunnel — les exposer comme deux sous-composants du même dossier, tous deux ré-exportés par le même `index.ts` :

- **`ProgressSteps`** : ligne horizontale d'étapes numérotées. Chaque étape a un badge numéroté (rond/carré à coins arrondis) + un label texte. États : `done`/`current` (badge plein `theme.colors.brand.primary`, texte accentué), `upcoming` (badge et texte neutres/atténués). Props : `steps: { label: string }[]`, `currentStep: number` (index 1-based)
- **`ProgressBar`** : barre de progression linéaire fine, remplissage proportionnel en `theme.colors.brand.primary` sur fond `theme.colors.slate[200]`, avec un texte d'accompagnement (`"Étape {n} sur {total}"`) au-dessus. Props : `value: number` (0–100), `label?: string`

Utilisation typique dans le tunnel : `ProgressSteps` (les 4-5 étapes définies dans `features.md`) au-dessus, `ProgressBar` en dessous pour le retour visuel fin de progression au sein de l'étape courante.

---

## 5. Phase 4 — Mise à jour des imports

Une fois la nouvelle arborescence en place :
- Rechercher toute référence à l'ancien chemin (`@/components/Common/...`, `@/components/Layout/...`, `@/theme/...`) dans l'ensemble du code front (Pages, Layouts, autres composants)
- Remplacer par les nouveaux chemins (`@/ui/components/<Catégorie>/<Composant>`, `@/ui/Layouts/<Nom>`, `@/ui/theme`)
- Vérifier qu'aucun import ne pointe vers un fichier interne d'un composant (toujours passer par le dossier via son `index.ts`, jamais par exemple `@/ui/components/Base/Button/Button.tsx` directement)

---

## Contraintes de sortie

- Respecter scrupuleusement la convention `ui-kit.md` : un dossier par composant, `index.ts` ré-exportant le défaut + les variantes nommées
- Ne pas casser les props/API des composants existants qui étaient corrects — seule la localisation et l'organisation des fichiers changent pour ceux-là
- `DESIGN_SYSTEM.md` fait autorité sur les valeurs de tokens ; en cas de divergence avec un ancien fichier de tokens, `DESIGN_SYSTEM.md` gagne
- Toujours thème clair unique, pas de mode sombre
- Livrer un **rapport de migration** final : tableau récapitulatif fichier par fichier (ancien chemin → nouveau chemin, ou "supprimé et régénéré"), plus la liste des nouveaux composants créés (`SelectableCard`, `SelectableAutocomplete`, `Progress`)
