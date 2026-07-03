# Prompt — Moteur du Tunnel de Simulation (`resources/js/core/`)

## Contexte

Le tunnel de demande de crédit est un formulaire multi-étapes (4-5 étapes, cf. `features.md`) avec affichage conditionnel (progressive disclosure). Il faut en extraire toute la logique métier dans un **moteur découplé de l'UI**, sous `resources/js/core/`, pour que les composants React (`Pages/Simulation/*`, `ui/components/Forms/*`) restent de simples vues qui consomment ce moteur.

**Contrainte d'architecture absolue** : le front React ne dialogue **jamais** directement avec le microservice Python de scoring. Le tunnel communique **exclusivement** avec le backend Laravel (endpoints Inertia/JSON). C'est Laravel, en aval et de façon asynchrone (Jobs/Queues, cf. `architecture.md`), qui appelle l'API Python si nécessaire. Le moteur front ne doit donc contenir aucune URL, aucun schéma, aucune connaissance de l'API Python.

## Objectif

Créer, sous `resources/js/core/`, un moteur de tunnel qui gère :
1. **Navigation** entre étapes (avec règles conditionnelles)
2. **Store** des données saisies (état centralisé, persistant en cours de session)
3. **Validation** de saisie (par étape et globale)
4. **Formatage** des données pour l'envoi (nettoyage des masques monétaires, mapping vers le contrat attendu par Laravel)
5. **Soumission** vers Laravel

---

## ⚠️ Directive impérative — livrable FONCTIONNEL, pas un squelette

Une première tentative a produit un **stub** (un `steps.ts` + un `useTunnel.ts` minimalistes qui se contentent de suivre `currentStep` et de dériver un pourcentage, en renvoyant toute la vraie logique « au prompt dédié »). **Ce n'est pas acceptable comme livrable final.** Ce prompt EST le prompt dédié : il faut donc écrire la logique réelle et complète, pas la reporter.

Interdits explicites :
- ❌ Aucun `// TODO`, `// à implémenter plus tard`, `// belongs to the dedicated prompt`, ni fonction qui `return`  une valeur vide/mock en attendant.
- ❌ Aucune navigation qui se contente d'incrémenter/décrémenter un compteur sans valider ni tenir compte des étapes masquées.
- ❌ Aucun store vide : le store doit réellement contenir et exposer **toutes** les données saisies (champs `dossier` + `personnes[]`), pas seulement l'index d'étape.
- ❌ Aucune persistance absente : la saisie doit réellement être écrite et relue depuis le storage à chaque changement.

À la fin, les 4 reproches suivants doivent être **matériellement résolus dans le code livré** (ils constituent la *definition of done*, revérifiée en fin de prompt) :
1. **La validation existe et s'exécute** — on ne peut pas passer une étape invalide.
2. **La navigation entre étapes est fonctionnelle** — `next`/`prev`/`goTo` marchent, sautent les étapes non pertinentes, et bloquent l'avance si l'étape courante est invalide.
3. **Le tunnel a un vrai state** — toutes les données saisies vivent dans le store, pas juste `currentStep`.
4. **La saisie est persistée** — rechargée automatiquement au refresh depuis le storage (cf. §5), pas perdue.

### Réconciliation avec le stub existant

Le stub actuel expose ce contrat public (déjà consommé par la page tunnel) : `TUNNEL_STEPS`, `PROJECT_DURATIONS`, `useTunnel()` renvoyant `{ steps, currentStep, progressPercent, goNext, goPrevious }`.

- **Ne pas casser** ce que la page consomme déjà (`TUNNEL_STEPS`, `currentStep`, `progressPercent`). Le nouveau moteur peut réexposer ces mêmes noms depuis `@/core/tunnel` (ré-export dans l'`index.ts`), quitte à faire de `useTunnel` une façade au-dessus du store + navigation.
- **Absorber/remplacer** le `useTunnel` minimal : sa logique (compteur + pourcentage) devient un sous-ensemble de la navigation réelle décrite en §6.
- **Corriger la divergence de données** : le stub déclare `PROJECT_DURATIONS = [12,24,36,48,60,72,84]`, ce qui **contredit `db.md`** (`6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120`). La liste faisant foi est celle de `db.md` — utiliser `[6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120]`. Si une réduction volontaire de l'offre commerciale est souhaitée, elle doit être décidée explicitement, pas héritée par accident d'un stub.
- Le `TunnelStepMeta` du stub (`{ index, label }`) et le format `{ key, label, order }` de §2 doivent être unifiés en **un seul type** : conserver un `key` stable (pour le mapping des champs et la validation) ET un ordre, l'`index` 1-based pouvant être dérivé de l'ordre.

---

## 0. Réutilisation de la lib maison `core-ts`

Le projet dispose d'une lib TypeScript interne (`core-ts`) déjà éprouvée. Le moteur doit **s'appuyer dessus plutôt que réimplémenter** ce qui existe. Attention toutefois : une partie de `core-ts` est **orientée DOM/vanilla** et ne doit **pas** être utilisée à l'intérieur de composants React (la manipulation directe du DOM entre en conflit avec le cycle de rendu React et provoque des bugs). On distingue donc :

### ✅ Briques à réutiliser (pures / agnostiques du framework)

| Brique `core-ts` | Où l'utiliser dans le moteur |
|---|---|
| `fetchAPI<T>()` + `ApiError` (request) | `core/http/client.ts` et la soumission — client HTTP unique vers Laravel |
| `ApiError.getValidationErrors()` | Mapping des erreurs 422 de Laravel `{ champ: message }` sur les champs du formulaire |
| `ApiError.isClientError()` / `isServerError()` / `isNetworkError()` / `getErrorMessage()` | Gestion fine des états d'erreur de soumission |
| `HTTP_STATUS` | Constantes de codes HTTP (éviter les nombres magiques : `422`, `201`...) |
| `router()`, `addQueryParams`, `getCurrentPath` (request) | Construction d'URL Laravel si besoin (ex. redirection vers `/resultat`) |
| `StorageService('session')` (storage) | Persistance de la saisie du tunnel en `sessionStorage` (sérialisation JSON auto, garde-fou quota/incognito intégré) |
| `isEmail`, `isEmpty`, `sanitize`, `capitalize`, `slugify` (string) | Appoints de validation/normalisation légère (l'autorité de validation reste Zod, cf. §4) |
| `DateCalculator.diff()` / `DateCalculator.isPast()` / `ensureDate()` (date) | Contrôle "majeur" sur `birth_date`, comparaisons de dates |
| `DateFormatter.short()` (date) | Affichage FR des dates si nécessaire (`JJ/MM/AAAA`) |

### ⛔ Briques à NE PAS utiliser dans le moteur/les composants React

- `FormManager`, `SelectableField`, et les helpers `fillInput`/`getInputValue`/`clearInput`... (forms) → **vanilla DOM**. En React, la source de vérité est le state (store + React Hook Form), pas le DOM. Réimplémenter l'équivalent en React (déjà prévu : `SelectableCard`, `Field`, `FieldError` dans l'UI Kit).
- `$`, `createElement`, `insertElementToDOM` (dom) → manipulation DOM impérative, incompatible React.
- `DragNDrop`, `copyToClipboard`/`initClipboardHandlers` (drag-n-drop, clipboard) → non pertinents pour le tunnel, et DOM-couplés.
- `FileUploader`, `convertMarkdownToHtml` → hors périmètre du tunnel.

> Règle : dans `core/` et les composants React, on ne consomme de `core-ts` que les **fonctions/classes pures** (calcul, validation, HTTP, storage, format), jamais celles qui touchent directement au DOM.

### Point d'attention `fetchAPI` vs Inertia — privilégier le natif

Rappel du cadrage retenu pour `core-ts` sur ce projet : on ne réutilise que les briques **pures/agnostiques** (storage, string, date). Les briques couplées au DOM sont exclues (cf. tableau ⛔), et **le HTTP est un cas limite** : `fetchAPI` (axios) fait doublon avec le client de requêtes qu'**Inertia possède déjà** nativement.

En conséquence, l'approche par défaut recommandée est :
- **Soumission via Inertia natif** (`router.post`) : c'est la voie idiomatique de la stack, sans dépendance HTTP supplémentaire, avec gestion CSRF et redirection intégrées. Les erreurs de validation 422 de Laravel reviennent nativement dans `errors` d'Inertia et se mappent sur les champs.
- **`fetchAPI`/`ApiError` uniquement si** un vrai besoin le justifie (ex. appel JSON hors flux de page, retry, `getValidationErrors()` réutilisé ailleurs) — et en assumant sciemment d'ajouter axios à côté d'Inertia.

Ne pas introduire `fetchAPI` juste par familiarité : si Inertia couvre le besoin (poster un dossier + lire les 422), c'est suffisant. → **à trancher** en fin de prompt. Dans les deux cas, veiller au token CSRF Laravel.

---

## 1. Arborescence cible

```text
resources/js/core/
├── tunnel/
│   ├── config/
│   │   ├── steps.ts            # définition déclarative des étapes et de leur ordre
│   │   └── fieldVisibility.ts  # règles d'affichage conditionnel des champs
│   │
│   ├── schema/
│   │   ├── dossierSchema.ts    # schémas Zod par étape (source de vérité de la validation front)
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── useTunnelStore.ts   # store d'état (Zustand recommandé, ou Context+reducer)
│   │   └── types.ts            # types du state du tunnel
│   │
│   ├── navigation/
│   │   └── useTunnelNavigation.ts  # hook: next/prev/goTo, calcul de l'étape suivante réelle
│   │
│   ├── format/
│   │   ├── money.ts            # parse "15 000 €" -> 15000, et format inverse pour l'affichage
│   │   └── payload.ts          # transforme le state du tunnel en payload API Laravel
│   │
│   ├── submission/
│   │   └── useTunnelSubmission.ts  # soumission vers Laravel + gestion loading/erreurs
│   │
│   └── index.ts                # API publique du moteur (ce que les Pages importent)
│
└── http/
    └── client.ts               # wrapper HTTP unique vers Laravel (Inertia ou axios/fetch)
```

Les composants de `Pages/Simulation/*` n'importent que depuis `@/core/tunnel` — jamais un fichier interne.

---

## 2. Configuration déclarative des étapes — `config/steps.ts`

Décrire les étapes de manière déclarative (pas de logique de navigation en dur dans les composants) :

```typescript
export const TUNNEL_STEPS = [
  { key: 'projet',    label: 'Votre besoin',        order: 1 },
  { key: 'situation', label: 'Votre logement',      order: 2 },
  { key: 'pro',       label: 'Votre profil pro',    order: 3 },
  { key: 'finances',  label: 'Votre consommation',  order: 4 },
  { key: 'identite',  label: 'Votre profil',        order: 5 },
] as const;
```

> Aligner les libellés exacts sur ceux du header du tunnel (cf. captures : "Votre besoin", "Votre logement", "Votre consommation", "Votre profil"). Ajuster le nombre d'étapes (4 ou 5) selon le regroupement final retenu — le moteur ne doit pas coder "en dur" 4 ou 5, il dérive tout de `TUNNEL_STEPS`.

Chaque étape mappe vers un ensemble de champs du modèle de données (cf. `db.md` : table `dossiers` + table `personnes`). Documenter ce mapping dans la config pour que le `ProgressSteps`/`ProgressBar` (composant `Navigation/Progress`) se branche directement dessus.

---

## 3. Règles d'affichage conditionnel — `config/fieldVisibility.ts`

Centraliser les règles de progressive disclosure (issues de `specs.md`), sous forme de prédicats purs testables, jamais de `if` éparpillés dans le JSX :

- `family_situation_year` visible si `family_situation ∈ {marie, pacs, divorce_veuf}`
- Bloc co-emprunteur (`personnes[1]`) visible si `has_coborrower === true` (par défaut activé si `family_situation === marie`)
- `housing_status_year` visible si `housing_status ∈ {proprietaire, locataire}`
- `charge_mortgage_remaining` & `housing_property_value` requis/visibles si `housing_status === proprietaire`
- `probation_period_ended` visible/requis si `employment_contract === cdi`
- `professional_job` dépend du `professional_sector` sélectionné (liste filtrée dynamiquement via `ProfessionalSectorEnum.professions()`)
- Champs crédit conso (`charge_consumer_credit_monthly`, `charge_consumer_credit_remaining`) visibles/requis si `has_active_consumer_credit === true`
- `maiden_name` requis si `civility === mme` (et situation maritale concernée, cf. specs)
- `nationality` optionnelle si `birth_country === france`

Chaque règle = fonction pure `(state) => boolean`, réutilisée à la fois par l'UI (afficher/masquer) et par la validation (rendre requis/optionnel).

---

## 4. Validation — `schema/dossierSchema.ts`

- Un schéma **Zod par étape** + un schéma global composé, cohérents avec `React Hook Form` (déjà prévu dans `architecture.md`)
- Les règles conditionnelles de `specs.md` s'expriment via `superRefine`/`refine` (ex. `charge_mortgage_remaining` requis si propriétaire)
- Les enums Zod doivent refléter **exactement** les valeurs des Backed Enums PHP (`ProjectTypeEnum`, `FamilySituationEnum`, etc. de `db.md`) — pas de désynchronisation front/back
- Contraintes numériques : montants > 0, `project_duration ∈ {6,12,...,120}`, date de naissance = majeur (contrôle via `DateCalculator.diff()`/`ensureDate()` de `core-ts` : au moins 18 ans révolus), format téléphone FR, format email (réutiliser `isEmail` de `core-ts` en complément du schéma Zod)
- La validation front est une **première barrière UX** ; elle ne remplace pas la validation serveur (Form Requests Laravel), qui reste l'autorité finale

Le moteur expose une fonction `validateStep(stepKey, state)` renvoyant les erreurs éventuelles, consommée par la navigation (on ne peut pas avancer si l'étape courante est invalide).

**Contrat attendu (à implémenter réellement, pas à esquisser) :**

```typescript
// schema/dossierSchema.ts
export const stepSchemas: Record<TunnelStepKey, ZodSchema>;   // un schéma par étape
export const dossierSchema: ZodSchema;                        // schéma global composé

export interface StepValidationResult {
  valid: boolean;
  errors: Record<string, string>;   // { 'dossier.project_amount': 'Montant requis', ... }
}

// Valide UNIQUEMENT les champs visibles de l'étape (selon fieldVisibility),
// applique les refinements conditionnels, retourne les erreurs mappées par champ.
export function validateStep(stepKey: TunnelStepKey, state: TunnelState): StepValidationResult;

// Valide l'ensemble avant soumission finale.
export function validateAll(state: TunnelState): StepValidationResult;
```

- `validateStep` ne valide que les champs **actuellement visibles** (un champ masqué par `fieldVisibility` n'est jamais requis).
- Les messages d'erreur sont en français, prêts à l'affichage dans `FieldError`.
- Intégration React Hook Form : fournir les schémas via `zodResolver` ; `validateStep` reste utilisable hors RHF pour la garde de navigation.

---

## 5. Store — `store/useTunnelStore.ts`

- État centralisé de tout le tunnel : données `dossier` + tableau `personnes` (emprunteur, éventuel co-emprunteur), étape courante, statut de validation par étape
- **Zustand** recommandé pour la simplicité et l'absence de boilerplate (alternative acceptable : Context + `useReducer` si tu préfères ne pas ajouter de dépendance — à trancher)
- Persistance en cours de session : conserver la saisie si l'utilisateur rafraîchit la page, **via `StorageService('session')` de `core-ts`** (sérialisation JSON automatique, gestion du quota/incognito déjà intégrée — ne pas réappeler `sessionStorage` directement). On utilise `session` et non `local` : données financières sensibles, pas de rémanence après fermeture de l'onglet. Prévoir un `reset()` complet (`storage.clear()`/`remove()` de la clé du tunnel) utilisé après soumission réussie ou via le CTA "nouvelle simulation"
- Le store ne stocke **que** l'état de saisie brut ; le formatage pour l'API se fait au moment de la soumission, pas dans le store

**Contrat attendu (à implémenter réellement) — le state n'est PAS juste `currentStep` :**

```typescript
// store/types.ts
export interface DossierState {
  project_type: ProjectType | null;
  project_amount: number | null;
  project_duration: number | null;
  family_situation: FamilySituation | null;
  family_situation_year: string | null;
  has_coborrower: boolean;
  housing_status: HousingStatus | null;
  housing_status_year: string | null;
  income_net_monthly: number | null;
  income_rental: number | null;
  // ... TOUS les champs de la table `dossiers` (revenus + charges), cf. db.md
}

export interface PersonneState {
  role: 'emprunteur' | 'co_emprunteur';
  civility: Civility | null;
  last_name: string | null;
  // ... TOUS les champs de la table `personnes`, cf. db.md
}

export interface TunnelState {
  currentStep: number;                         // 1-based
  dossier: DossierState;
  personnes: PersonneState[];                  // [emprunteur] ou [emprunteur, coEmprunteur]
  stepStatus: Record<TunnelStepKey, 'untouched' | 'valid' | 'invalid'>;
}

// store/useTunnelStore.ts — actions réelles, pas des stubs :
interface TunnelStoreActions {
  setField<K extends keyof DossierState>(field: K, value: DossierState[K]): void;
  setPersonneField(role, field, value): void;
  toggleCoborrower(enabled: boolean): void;    // ajoute/retire personnes[1]
  setCurrentStep(step: number): void;
  markStep(stepKey: TunnelStepKey, status): void;
  hydrateFromStorage(): void;                  // relit StorageService('session') au montage
  reset(): void;                               // vide state + storage
}
```

- À **chaque** mutation, le store persiste le nouveau state via `StorageService('session')` (write-through). Au montage du tunnel, `hydrateFromStorage()` réinjecte la saisie sauvegardée → la definition of done #4 est satisfaite.
- Valeurs initiales explicites : `has_coborrower: false`, `personnes: [{ role: 'emprunteur', ... }]`, consentements RGPD à `false`.

## 6. Navigation — `navigation/useTunnelNavigation.ts`

- `next()` : valide l'étape courante (`validateStep`), puis calcule la **prochaine étape réellement affichable** (une étape peut être sautée si toutes ses conditions d'affichage sont fausses — dérivé de `fieldVisibility`)
- `prev()`, `goTo(stepKey)` (uniquement vers une étape déjà validée / accessible)
- Expose `currentStep`, `totalSteps`, `progressPercent` (0–100) pour brancher `ProgressSteps` et `ProgressBar`
- Bloque l'accès direct à une étape non atteignable (garde de navigation)

**Contrat attendu (à implémenter réellement — la navigation doit VRAIMENT fonctionner) :**

```typescript
export interface UseTunnelNavigationResult {
  currentStep: number;              // 1-based
  currentStepKey: TunnelStepKey;
  totalSteps: number;               // dérivé de TUNNEL_STEPS (jamais codé en dur)
  progressPercent: number;          // 0..100
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;               // false si l'étape courante est invalide
  goNext: () => boolean;            // valide → avance vers la prochaine étape visible ; retourne false si bloqué
  goPrevious: () => void;           // recule vers l'étape visible précédente
  goTo: (step: number | TunnelStepKey) => boolean;  // refusé si étape non atteignable
}
```

Comportement obligatoire de `goNext()` :
1. Lance `validateStep(currentStepKey, state)`.
2. Si invalide → `markStep(..., 'invalid')`, ne bouge pas, retourne `false` (l'UI affiche les erreurs).
3. Si valide → `markStep(..., 'valid')`, calcule la prochaine étape dont au moins un champ est visible selon `fieldVisibility` (saute les étapes entièrement masquées), met à jour `currentStep`, retourne `true`.

`progressPercent` se calcule sur le **nombre d'étapes réellement visibles** pour le parcours courant, pas sur le total brut de `TUNNEL_STEPS` (sinon la barre saute). Documenter ce choix.

---

## 7. Formatage — `format/`

### `money.ts`
- `parseMoney("15 000 €") -> 15000` (retire séparateurs de milliers, symbole €, espaces insécables) — miroir front du service de parsing Laravel décrit dans `features.md`
- `formatMoney(15000) -> "15 000 €"` pour l'affichage (masque de saisie du `MoneyInput`)
- Renvoie des nombres stricts, jamais de string, pour éviter toute ambiguïté avant envoi

### `payload.ts`
- `buildDossierPayload(state) -> DossierPayload` : transforme l'état du tunnel en objet correspondant **au contrat attendu par le contrôleur Laravel** (structure `dossier` + `personnes[]`)
- Applique `parseMoney` sur tous les champs monétaires (décimaux stricts, ex. `15000.00`)
- N'envoie pas les champs masqués/non pertinents (ex. pas de `charge_mortgage_remaining` si l'utilisateur n'est pas propriétaire) — nettoyage cohérent avec les règles de visibilité
- Mappe les rôles en `personnes` : `role: 'emprunteur'` / `role: 'co_emprunteur'` (valeurs exactes de `PersonRoleEnum`)
- Ce payload cible **Laravel uniquement** — aucune structure liée à l'API Python

---

## 8. Soumission — `submission/useTunnelSubmission.ts`

- Appelle `buildDossierPayload`, puis envoie vers l'endpoint **Laravel** (route de création de dossier), via le wrapper `core/http/client.ts` (lui-même bâti sur `fetchAPI` de `core-ts`)
- Utiliser `fetchAPI<T>()` avec `method: 'POST'` et le payload en `body` (sérialisation JSON auto) vers une route API Laravel dédiée ; alternative Inertia `router.post` si retenu (voir décisions)
- Gérer les états : `idle` / `submitting` / `success` / `error` (utiliser `HTTP_STATUS` de `core-ts` plutôt que des codes en dur)
- En cas de succès : `reset()` du store + redirection vers `/simulation/credit-consommation/resultat`
- En cas d'erreur, capturer l'`ApiError` de `core-ts` :
  - `error.getValidationErrors()` (422) → objet `{ champ: message }` mappé directement sur les champs via `FieldError`, **sans perdre la saisie**
  - `error.isServerError()` (5xx) / `error.isNetworkError()` → message générique de réessai, la saisie est conservée (le store et le `StorageService('session')` protègent contre la perte de données)
- **Le front ne connaît ni n'attend le résultat du scoring Python** au moment de la soumission : la réponse Laravel confirme la prise en compte du dossier (réponse de principe sous 24h). Le scoring/les offres, s'ils existent, arrivent de façon asynchrone côté Laravel et sont affichés plus tard (page résultat ou CRM), pas dans la réponse synchrone de soumission.

---

## 9. `http/client.ts`

- **Wrapper mince au-dessus de `fetchAPI` de `core-ts`** — ne pas réimplémenter un client axios/fetch, mais préconfigurer/centraliser l'usage de `fetchAPI` pour ce projet (base URL Laravel, header CSRF `X-XSRF-TOKEN`, gestion d'erreurs typée via `ApiError`)
- Point d'entrée unique : aucun appel `fetchAPI`/`fetch`/axios dispersé dans les composants ou ailleurs dans le moteur — tout passe par ce wrapper
- Expose des méthodes métier lisibles (ex. `submitDossier(payload): Promise<DossierResponse>`) plutôt que des appels HTTP bruts dans la couche soumission
- Aucune configuration ni endpoint pointant vers le microservice Python (ce serait une violation de l'architecture)

---

## Contraintes de sortie

- Séparation stricte moteur/UI : `resources/js/core/` ne contient aucun JSX, aucun composant visuel — uniquement logique, hooks, schémas, types
- Le front ne communique qu'avec Laravel ; zéro référence au microservice Python où que ce soit dans `core/`
- Les enums et règles de validation front doivent rester alignés sur `db.md` / `specs.md` (valeurs exactes des Backed Enums PHP)
- TypeScript strict, pas de `any` ; tous les types de payload exportés
- Décisions à confirmer avant génération : (a) Zustand vs Context+reducer pour le store ; (b) soumission via **Inertia `router.post` (recommandé par défaut, natif à la stack)** vs `fetchAPI` (route API JSON dédiée, seulement si un besoin réel le justifie — cf. §0)
- Réutiliser en priorité les briques **pures** de `core-ts` (request/`fetchAPI`+`ApiError`, storage/`StorageService`, string, date) ; ne jamais utiliser dans React les briques DOM-couplées (`FormManager`, `SelectableField`, `$`, `createElement`, `DragNDrop`, clipboard) — cf. §0
- Livrer un récapitulatif final : fichiers créés par sous-dossier, briques `core-ts` réellement consommées et où, et un schéma texte du flux `saisie → store → validation → format → soumission → Laravel`

---

## ✅ Definition of Done (à vérifier explicitement avant de rendre)

Reprendre ces points un par un dans le récapitulatif final, en pointant le fichier/la fonction qui le satisfait :

1. **Validation** — `validateStep` et `validateAll` existent, valident uniquement les champs visibles, retournent des erreurs mappées par champ. `goNext()` refuse d'avancer sur une étape invalide. → Aucun `TODO`.
2. **Navigation fonctionnelle** — `goNext`/`goPrevious`/`goTo` déplacent réellement l'étape courante, sautent les étapes entièrement masquées, et respectent la garde de validation. `progressPercent` reflète les étapes visibles.
3. **State réel** — le store contient tous les champs `dossier` + `personnes[]` (pas seulement `currentStep`), avec les actions `setField`/`setPersonneField`/`toggleCoborrower`/`reset`.
4. **Persistance** — chaque mutation écrit dans `StorageService('session')` ; `hydrateFromStorage()` relit la saisie au montage ; `reset()` purge state + storage. Vérifier concrètement : saisir → rafraîchir la page → la saisie est toujours là.
5. **Contrat public préservé** — `@/core/tunnel` réexpose `TUNNEL_STEPS`, `currentStep`, `progressPercent` (et `PROJECT_DURATIONS` corrigé sur `db.md`) pour ne pas casser la page tunnel existante.
6. **Isolation Python** — aucune référence au microservice Python nulle part dans `core/`.

Si l'un de ces points ne peut être satisfait, l'expliquer explicitement plutôt que de livrer un stub qui en donne l'illusion.