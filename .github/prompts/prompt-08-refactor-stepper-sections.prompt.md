# Prompt — Refactor du Tunnel : Stepper par Sections + Audit Responsive

## Nature de ce prompt

Ce prompt est un **refactor incrémental** sur du code **déjà généré et fonctionnel** (moteur `resources/js/core/tunnel/`, vue `resources/js/Pages/Simulation/`, composant `Progress` de l'UI Kit). Il ne repart pas de zéro : il faut d'abord **analyser l'existant**, puis appliquer les modifications décrites. Ne réécrire que ce qui doit changer ; préserver tout ce qui fonctionne déjà (persistance/reprise, validation, soumission, isolation vis-à-vis de l'API Python).

## Objectifs

1. Introduire une notion de **sections** dans le tunnel : une section regroupe plusieurs étapes. Le **stepper affiche les sections** (marqueurs grossiers), tandis que la **barre de progression avance au rythme des étapes** (granularité fine).
2. Restructurer les étapes selon la nouvelle répartition (5 sections / 12 étapes).
3. Gérer les étapes conditionnelles du co-emprunteur.
4. **Auditer et corriger la responsivité** de tous les composants concernés.

Gain UX visé : même quand le marqueur de section ne bouge pas (on progresse à l'intérieur d'une section), la barre avance → plus d'impression de tunnel interminable ni de stagnation.

---

## Phase 0 — Analyse de l'existant (obligatoire avant toute modif)

Inventorier et rapporter, avant de coder :
- `resources/js/core/tunnel/config/steps.ts` : structure actuelle des étapes (le stub avait `TUNNEL_STEPS` à plat, labels type "Votre besoin/logement/…").
- `resources/js/core/tunnel/config/fieldVisibility.ts` : règles conditionnelles présentes.
- `resources/js/core/tunnel/navigation/*` : comment `currentStep`/`progressPercent` sont calculés aujourd'hui.
- `resources/js/core/tunnel/store/*` : forme du state, ce qui est persisté.
- `resources/js/Pages/Simulation/Tunnel.tsx` + `steps/*` : composants d'étape existants et registre.
- Composant `Progress` (`resources/js/ui/components/Navigation/Progress/`) : contrat actuel de `ProgressSteps`/`ProgressBar`.

Produire un court état des lieux (ce qui existe, ce qui devra être modifié vs conservé) avant d'attaquer les phases suivantes.

---

## Phase 1 — Modèle Sections & Étapes (moteur)

Faire évoluer `config/steps.ts` vers un modèle à deux niveaux **sans casser les exports déjà consommés** (`TUNNEL_STEPS`, `PROJECT_DURATIONS` restent exportés ; `TUNNEL_STEPS` devient la liste à plat des étapes).

### Répartition cible — 5 sections / 12 étapes

| # étape | `key` étape | Section (`key`) | Libellé section (stepper) | Contenu de l'étape | `scope` |
|---|---|---|---|---|---|
| 1 | `projet_type` | `projet` | Votre projet | Type de projet | none |
| 2 | `projet_montant` | `projet` | Votre projet | Montant + durée | none |
| 3 | `situation_familiale` | `situation` | Votre situation | Situation familiale **+ toggle co-emprunteur** | none |
| 4 | `situation_logement` | `situation` | Votre situation | Situation logement | none |
| 5 | `pro_emprunteur` | `pro` | Situation professionnelle | Situation pro emprunteur | borrower |
| 6 | `pro_coemprunteur` | `pro` | Situation professionnelle | Situation pro co-emprunteur | coborrower |
| 7 | `revenus` | `finances` | Situation financière | Revenus | none |
| 8 | `charges` | `finances` | Situation financière | Charges | none |
| 9 | `civilite` | `profil` | Votre profil | Civilité, nom, prénom — **emprunteur + co-emprunteur** dans la même étape | none |
| 10 | `nationalite` | `profil` | Votre profil | Date de naissance, pays de naissance, nationalité — emprunteur + co-emprunteur | none |
| 11 | `contact_emprunteur` | `profil` | Votre profil | Contact + consentements emprunteur | borrower |
| 12 | `contact_coemprunteur` | `profil` | Votre profil | Contact + consentements co-emprunteur | coborrower |

### Structures à introduire

```typescript
export type PersonScope = 'none' | 'borrower' | 'coborrower';
export type TunnelSectionKey = 'projet' | 'situation' | 'pro' | 'finances' | 'profil';

export interface TunnelStepMeta {
  key: TunnelStepKey;
  sectionKey: TunnelSectionKey;
  label: string;
  scope: PersonScope;
}

export interface TunnelSectionMeta {
  key: TunnelSectionKey;
  label: string;             // libellé affiché dans le stepper
  stepKeys: TunnelStepKey[];
}

export const TUNNEL_SECTIONS: readonly TunnelSectionMeta[] = [
  { key: 'projet',    label: 'Votre projet',              stepKeys: ['projet_type', 'projet_montant'] },
  { key: 'situation', label: 'Votre situation',           stepKeys: ['situation_familiale', 'situation_logement'] },
  { key: 'pro',       label: 'Situation professionnelle', stepKeys: ['pro_emprunteur', 'pro_coemprunteur'] },
  { key: 'finances',  label: 'Situation financière',      stepKeys: ['revenus', 'charges'] },
  { key: 'profil',    label: 'Votre profil',              stepKeys: ['civilite', 'nationalite', 'contact_emprunteur', 'contact_coemprunteur'] },
] as const;

// Helpers dérivés à exporter :
export const TUNNEL_STEPS: readonly TunnelStepMeta[];                       // 12 étapes à plat, ordonnées
export function getVisibleSteps(state: TunnelState): TunnelStepMeta[];
export function getSectionOfStep(stepKey: TunnelStepKey): TunnelSectionMeta;
```

### Étapes conditionnelles (co-emprunteur) — `fieldVisibility.ts`

Ajouter un niveau de visibilité **par étape** (en plus de la visibilité par champ déjà en place) :

```typescript
export function isStepVisible(stepKey: TunnelStepKey, state: TunnelState): boolean;
// Les étapes scope 'coborrower' (pro_coemprunteur, contact_coemprunteur)
// ne sont visibles que si state.dossier.has_coborrower === true.
// Toutes les autres : toujours visibles.
```

`has_coborrower` est défini à l'étape 3 (`situation_familiale`), activé par défaut si `family_situation === 'marie'`. Il pilote deux niveaux :
- **Niveau étape** : les étapes entièrement co-emprunteur (`pro_coemprunteur`, `contact_coemprunteur`) sont retirées du parcours si `false` → on passe de **12 à 10 étapes visibles**.
- **Niveau champ (dans une étape mixte)** : les étapes `civilite` et `nationalite` contiennent **à la fois** le bloc emprunteur et le bloc co-emprunteur ; le bloc co-emprunteur y est masqué au niveau champ si `has_coborrower === false` (l'étape, elle, reste toujours visible).

---

## Phase 2 — Navigation & Progression (moteur)

Adapter `navigation/useTunnelNavigation.ts` pour exposer **les deux granularités** :

```typescript
export interface UseTunnelNavigationResult {
  // Étapes (fin — pilote la barre)
  currentStep: number;              // 1-based dans les étapes VISIBLES
  currentStepKey: TunnelStepKey;
  totalVisibleSteps: number;        // 10 ou 12 selon has_coborrower
  progressPercent: number;          // sur étapes visibles → avance à CHAQUE étape

  // Sections (grossier — pilote le stepper)
  currentSectionKey: TunnelSectionKey;
  sections: { key: TunnelSectionKey; label: string; status: 'done' | 'current' | 'upcoming' }[];

  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  goNext: () => boolean;            // valide, saute les étapes co-emprunteur si masquées
  goPrevious: () => void;
  goToStep: (step: number | TunnelStepKey) => boolean;
}
```

Règles impératives :
- `progressPercent = currentStep / totalVisibleSteps * 100` (sur étapes **visibles**) → il augmente à chaque étape, y compris entre deux étapes d'une même section. C'est l'effet recherché.
- Statut de section : `done` si toutes ses étapes visibles sont validées, `current` si elle contient l'étape courante, `upcoming` sinon.
- `goNext()`/`goPrevious()` opèrent sur `getVisibleSteps(state)` : les étapes co-emprunteur masquées sont sautées automatiquement.
- Ne pas régresser sur l'acquis : la garde de validation (pas d'avance sur étape invalide) et la persistance/reprise de `currentStep` doivent continuer de fonctionner.

---

## Phase 3 — Composant `Progress` (UI Kit)

Refondre `resources/js/ui/components/Navigation/Progress/` pour refléter la dualité section/étape (cf. capture de référence fournie) :

- **`ProgressSteps`** affiche désormais les **SECTIONS**, pas les étapes. Chaque marqueur = une section, avec :
  - état `done` → pastille pleine `brand.primary` avec une coche (✓)
  - état `current` → pastille pleine `brand.primary` avec le **numéro de section**, label en gras
  - état `upcoming` → pastille neutre/atténuée avec le numéro, label atténué
  - séparateurs entre marqueurs (traits), comme sur la capture
  - Props : `sections: { key: string; label: string; status: 'done' | 'current' | 'upcoming' }[]`
- **`ProgressBar`** avance au niveau **étape** : `value` (0–100) = `progressPercent` du moteur, + caption `"Étape {n} sur {total}"` où `n`/`total` sont les **étapes visibles** (donc bouge à chaque étape).
  - Props : `value: number`, `label?: string`

Ces deux sous-composants restent dans le même dossier `Progress/`, ré-exportés par son `index.ts`. Ne pas dupliquer dans `Feedback/`.

---

## Phase 4 — Vue : Orchestrateur, StepShell & Étapes

### Registre — `steps/index.ts`
Le registre passe à **12 composants d'étape** (clés alignées sur `TUNNEL_STEPS`), un fichier par étape :

```text
resources/js/Pages/Simulation/steps/
├── ProjetType.tsx           # projet_type
├── ProjetMontant.tsx        # projet_montant
├── SituationFamiliale.tsx   # situation_familiale (+ toggle co-emprunteur)
├── SituationLogement.tsx    # situation_logement
├── ProEmprunteur.tsx        # pro_emprunteur
├── ProCoEmprunteur.tsx      # pro_coemprunteur   (visible si has_coborrower)
├── Revenus.tsx              # revenus
├── Charges.tsx              # charges
├── Civilite.tsx             # civilite (civilité, nom, prénom — emprunteur + co-emprunteur)
├── Nationalite.tsx          # nationalite (date naissance, pays naissance, nationalité — emp + coemp)
├── ContactEmprunteur.tsx    # contact_emprunteur
├── ContactCoEmprunteur.tsx  # contact_coemprunteur (visible si has_coborrower)
├── StepShell.tsx
└── index.ts                 # STEP_COMPONENTS: Record<TunnelStepKey, ComponentType>
```

- `Tunnel.tsx` reste un pur orchestrateur : lit `currentStepKey`, rend `STEP_COMPONENTS[currentStepKey]` dans `StepShell`. Aucune logique de champ.
- Les étapes co-emprunteur ne sont jamais atteintes si `has_coborrower === false` (la navigation les saute) — pas de garde à recopier dans les composants.
- **`StepShell`** affiche le nouveau header : `ProgressSteps` (sections) + `ProgressBar` (étapes) + titre d'étape + boutons Précédent/Suivant. Les étapes ne contiennent que leurs champs.
- Conserver le pré-remplissage depuis le store (init RHF depuis le store) déjà en place : les nouvelles étapes doivent suivre le même pattern (reprise + retour arrière pré-remplis).
- Les étapes `borrower`/`coborrower` (ex. `pro_emprunteur`/`pro_coemprunteur`, `contact_emprunteur`/`contact_coemprunteur`) ciblent respectivement `personnes[0]` / `personnes[1]` du store (via `setPersonneField`). Les étapes **mixtes** `civilite` et `nationalite` affichent dans un même écran le bloc `personnes[0]` **et**, si `has_coborrower`, le bloc `personnes[1]` — chaque bloc écrivant sur la personne correspondante.

### Champs par étape (source `db.md` + `specs.md`)
- `projet_type` : `project_type` (SelectableCard variante `card`)
- `projet_montant` : `project_amount` (MoneyInput), `project_duration` (Select, `PROJECT_DURATIONS`)
- `situation_familiale` : `family_situation`, `family_situation_year` (si marié/pacs/divorcé-veuf), `has_coborrower` (Switch)
- `situation_logement` : `housing_status`, `housing_status_year` (si propriétaire/locataire)
- `pro_emprunteur` / `pro_coemprunteur` : `professional_sector` → `professional_job` (filtré par secteur), `employment_contract`, `probation_period_ended` (si CDI), `professional_situation_date`
- `revenus` : `income_net_monthly` (requis) + `income_rental`/`income_allowance`/`income_other` (MoneyInput)
- `charges` : `charge_housing`, `charge_mortgage_remaining` + `housing_property_value` (si propriétaire), `has_active_consumer_credit` → `charge_consumer_credit_monthly`/`_remaining`, `charge_other`
- `civilite` : pour l'emprunteur **et** le co-emprunteur (bloc co-emprunteur affiché seulement si `has_coborrower`) → `civility` (M/Mme/Autre), `last_name`, `maiden_name` (si Mme + cas marital), `first_name`
- `nationalite` : pour l'emprunteur **et** le co-emprunteur (bloc co-emprunteur si `has_coborrower`) → `birth_date`, `birth_country`, puis `nationality`. **Le champ `nationality` est masqué par défaut** ; il n'apparaît **que si `birth_country !== 'france'`** (né hors de France). **Quand `birth_country === 'france'`, le champ reste masqué MAIS `nationality` doit être forcé à `'france'` dans le store** (pas laissé à `null`/vide) — sinon le dossier part avec une nationalité manquante à la soumission. Concrètement : au changement de `birth_country`, si la valeur devient `france`, écrire `nationality = 'france'` ; si elle devient autre chose, réafficher le champ (et si besoin réinitialiser la valeur pour forcer un choix explicite). Cette règle s'applique indépendamment à chaque personne (le pays de naissance de l'emprunteur pilote sa nationalité, idem co-emprunteur).
- `contact_emprunteur` / `contact_coemprunteur` : `phone`, `email`, 3 consentements RGPD

---

## Phase 5 — Audit Responsive (tous composants concernés)

Vérifier et corriger la responsivité. Plusieurs composants générés ne le sont peut-être pas — **à vérifier réellement, pas à supposer**.

- **`ProgressSteps` (sections)** : sur mobile, 5 marqueurs + libellés ne tiennent pas en ligne. Comportement attendu : soit condenser (afficher uniquement la section courante en toutes lettres + pastilles compactes pour les autres), soit scroll horizontal, soit repli sur "Section {i}/{n} — {label}". La `ProgressBar` + caption "Étape {n} sur {total}" reste toujours visible et lisible sur mobile.
- **Composants d'étape** : champs en pleine largeur sur mobile, en grille aérée sur desktop ; `SelectableCard` en grille passe de N colonnes (desktop) à 1–2 colonnes (mobile) ; les paires de champs (montant/durée, revenus, etc.) s'empilent sur petit écran.
- **`StepShell`** : boutons Précédent/Suivant accessibles au pouce sur mobile (taille de cible suffisante), éventuellement en barre d'action collée en bas sur mobile.
- **UI Kit en général** : passer en revue `Container`, `Grid`/`Row`/`Col`, `Card`, `Table`, `Modal`, `SelectableAutocomplete` (la liste déroulante doit rester dans le viewport mobile). Utiliser les breakpoints déjà définis dans les tokens (`sm`/`md`/`lg`/`xl`), pas de valeurs en dur.
- Vérifier l'absence de débordement horizontal (`overflow-x`) à 360px de large (petit mobile).

Livrer la liste des composants audités avec, pour chacun, "OK" ou "corrigé (quoi)".

---

## Contraintes de sortie

- Ne pas casser les acquis : persistance/reprise (`currentStep` + données), validation bloquante, soumission Inertia, isolation API Python.
- **Cohérence `nationality` à la soumission (filet de sécurité)** : dans le formatage du payload (`format/payload.ts`), pour chaque personne, si `birth_country === 'france'` et que `nationality` est vide/`null`, forcer `nationality = 'france'` avant l'envoi. Ainsi, même si la règle de saisie a été contournée, le dossier ne part jamais avec une nationalité manquante pour une personne née en France.
- Structure pilotée par la config (`TUNNEL_SECTIONS`/`TUNNEL_STEPS`) — aucun nombre d'étapes/sections codé en dur dans la vue ou la navigation.
- Convention UI Kit respectée (un dossier par composant, `index.ts`), styled-components, thème clair unique, breakpoints via tokens.
- TypeScript strict, pas de `any`.
- Livrables : état des lieux (Phase 0), diff conceptuel des fichiers moteur modifiés, liste des 12 composants d'étape + registre, refonte `Progress`, rapport d'audit responsive.
