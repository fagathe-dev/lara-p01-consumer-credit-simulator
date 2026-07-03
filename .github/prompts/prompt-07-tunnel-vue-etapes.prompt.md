# Prompt — Vue du Tunnel : Orchestrateur + Composants d'Étape

## Contexte & Problème à corriger

Le moteur du tunnel (`resources/js/core/tunnel/`, cf. prompt "Moteur du Tunnel") gère l'état, la navigation, la validation et la soumission. Mais la **couche vue** a été mal générée : toute l'étape 1 a été écrite en dur dans `resources/js/Pages/Simulation/Tunnel.tsx`, et **les autres étapes n'existent pas** comme composants.

Ce n'est pas la structure attendue. La cible est :
- **Un composant par étape**, dans son propre fichier, sous `resources/js/Pages/Simulation/steps/`.
- **`Tunnel.tsx` = orchestrateur uniquement** : il lit `currentStep` depuis le moteur et affiche le composant d'étape correspondant. Il ne contient **aucune logique de champ**. `currentStep === 1` → rend `Step1`, `=== 2` → `Step2`, etc.

## Objectif

Refactorer la vue du tunnel pour obtenir :
1. Un orchestrateur `Tunnel.tsx` qui route vers l'étape courante via un **registre d'étapes** (pas un gros `switch` en dur).
2. Un fichier par étape, chacun branché au moteur (store + validation + visibilité conditionnelle).
3. Un header de progression commun et des boutons de navigation communs, factorisés hors des étapes.

---

## 1. Arborescence cible

```text
resources/js/Pages/Simulation/
├── Tunnel.tsx                    # ORCHESTRATEUR — route vers l'étape courante, rien d'autre
├── Resultat.tsx                  # (déjà prévu) écran de confirmation post-soumission
└── steps/
    ├── Step1Projet.tsx           # Étape 1 — Le projet (type, montant, durée)
    ├── Step2Situation.tsx        # Étape 2 — Situation & résidence
    ├── Step3Pro.tsx              # Étape 3 — Situation professionnelle
    ├── Step4Finances.tsx         # Étape 4 — Revenus & charges
    ├── Step5Identite.tsx         # Étape 5 — Identité & contact (emprunteur + co-emprunteur)
    ├── StepShell.tsx             # coquille commune : header Progress + titre + boutons nav
    └── index.ts                  # registre { stepKey → composant } + ré-exports
```

> **Nombre d'étapes à confirmer (4 vs 5)** : `TUNNEL_STEPS` (moteur) déclare 5 étapes, mais les captures d'écran montrent 4 libellés ("Votre besoin", "Votre logement", "Votre consommation", "Votre profil"). Le découpage ci-dessus part sur 5. Si le choix final est 4 étapes, fusionner en conséquence (probablement Situation+Résidence, ou Pro dans Situation) — mais **le nombre et l'ordre restent pilotés par `TUNNEL_STEPS`**, jamais codés en dur dans la vue. Trancher avant génération.

---

## 2. Registre d'étapes — `steps/index.ts`

Associer chaque `TunnelStepKey` du moteur à son composant, pour que l'orchestrateur route par donnée et non par `if/switch` :

```typescript
import type { TunnelStepKey } from '@/core/tunnel';
import Step1Projet from './Step1Projet';
import Step2Situation from './Step2Situation';
import Step3Pro from './Step3Pro';
import Step4Finances from './Step4Finances';
import Step5Identite from './Step5Identite';

export const STEP_COMPONENTS: Record<TunnelStepKey, React.ComponentType> = {
  projet: Step1Projet,
  situation: Step2Situation,
  pro: Step3Pro,
  finances: Step4Finances,
  identite: Step5Identite,
};
```

> Les clés doivent correspondre **exactement** aux `key` de `TUNNEL_STEPS`. Si une clé de `TUNNEL_STEPS` n'a pas d'entrée ici (ou l'inverse), c'est une erreur de cohérence à signaler.

---

## 3. Orchestrateur — `Tunnel.tsx`

Responsabilité unique : afficher l'étape courante. Aucune logique de champ, aucune validation en dur.

```tsx
export default function Tunnel() {
  const { currentStepKey } = useTunnelNavigation();  // depuis @/core/tunnel
  useEffect(() => { hydrateFromStorage(); }, []);     // réhydrate la saisie au montage

  const StepComponent = STEP_COMPONENTS[currentStepKey];

  return (
    <StepShell>
      <StepComponent />
    </StepShell>
  );
}
```

- Monte le moteur : réhydratation depuis `StorageService('session')` au premier rendu (cf. prompt moteur, `hydrateFromStorage`).
- `currentStep === 1` affiche l'étape 1, etc. — mais via le **registre par clé**, pas un index magique.
- Layout : la page utilise le layout allégé du tunnel (cf. prompt "Pages Web", §4) — pas de CTA distrayants.
- Gère le cas `StepComponent` introuvable (clé inconnue) : fallback vers l'étape 1 + log.

---

## 4. Coquille commune — `steps/StepShell.tsx`

Factorise tout ce qui est identique d'une étape à l'autre, pour que chaque `StepX` ne contienne QUE ses champs :

- **Header de progression** : `ProgressSteps` + `ProgressBar` (`@/ui/components/Navigation/Progress`), branchés sur `steps`/`currentStep`/`progressPercent` du moteur.
- **Titre d'étape** (issu de `TUNNEL_STEPS[current].label`) + éventuel sous-titre commercial (ex. "Réalisez jusqu'à 500 € d'économies par an", cf. capture).
- **Zone de contenu** : `children` (les champs de l'étape).
- **Barre de navigation** : bouton "Précédent" (`goPrevious`, masqué sur l'étape 1) + bouton "Suivant"/"Valider ma demande" sur la dernière étape (`goNext`, ou déclenche la soumission si `isLastStep`). Le bouton "Suivant" appelle `goNext()` du moteur : c'est LUI qui valide et bloque si l'étape est invalide — la coquille ne réimplémente pas la validation.

---

## 5. Composants d'étape — règles communes

Chaque `StepX` est une **vue pure branchée au moteur**, jamais un conteneur de logique de navigation :

- Lit/écrit les champs via le store (`useTunnelStore` : `setField`, `setPersonneField`, valeurs courantes) — la source de vérité reste le state, pas le DOM.
- Utilise les composants de formulaire de l'UI Kit (`@/ui/components/Forms/*`) : `Field`, `FieldLabel`, `FieldError`, `Input`, `MoneyInput`, `Select`, `Checkbox`, `Radio`, `Switch`, `SelectableCard`, `SelectableAutocomplete`.
- **Affichage conditionnel** : montrer/masquer les champs via les prédicats de `fieldVisibility` du moteur (jamais de `if` de visibilité recopié en dur dans le JSX).
- **Erreurs** : afficher les messages issus de `validateStep`/RHF dans les `FieldError` correspondants.
- Ne contient **pas** les boutons Précédent/Suivant (ils sont dans `StepShell`).

### Répartition des champs par étape (source : `db.md` + `specs.md`)

- **Step1Projet** : `project_type` (via `SelectableCard` variante `card` avec icônes, cf. captures), `project_amount` (`MoneyInput`), `project_duration` (`Select`, valeurs de `PROJECT_DURATIONS` = `6,12,…,120` conformes à `db.md`).
- **Step2Situation** : `family_situation`, `family_situation_year` (visible si marié/pacs/divorcé-veuf), `has_coborrower` (`Switch`, activé par défaut si marié → `toggleCoborrower`), `housing_status`, `housing_status_year` (visible si propriétaire/locataire).
- **Step3Pro** : `professional_sector`, puis `professional_job` (liste filtrée dynamiquement selon le secteur via `ProfessionalSectorEnum.professions()`), `employment_contract`, `probation_period_ended` (visible/requis si CDI), `professional_situation_date` (MM/AAAA). Ces champs appartiennent à la **personne** (emprunteur, et co-emprunteur si présent).
- **Step4Finances** : revenus (`income_net_monthly` requis, `income_rental`/`income_allowance`/`income_other` optionnels) + charges (`charge_housing`, `charge_mortgage_remaining` + `housing_property_value` si propriétaire, `has_active_consumer_credit` → `charge_consumer_credit_monthly`/`_remaining`, `charge_other`). Tous les montants en `MoneyInput`.
- **Step5Identite** : pour l'emprunteur **et** le co-emprunteur si `has_coborrower` : `civility`, `last_name`, `maiden_name` (si Mme + cas marital), `first_name`, `birth_date`, `birth_country`, `nationality` (optionnelle si né en France), `phone`, `email`, + les 3 consentements RGPD (`Checkbox`/`Switch`). La `SelectableAutocomplete` sert pour la recherche de ville/CP si ce champ est ajouté.

> Le bloc co-emprunteur n'apparaît dans les étapes concernées (Pro, Identité) que si `has_coborrower === true` — géré via `fieldVisibility`, pas en dur.

---

## Contraintes de sortie

- `Tunnel.tsx` ne contient aucune logique de champ ni de validation : uniquement le routage vers l'étape courante via `STEP_COMPONENTS`.
- Une étape = un fichier ; aucun champ d'une étape ne doit résider dans `Tunnel.tsx` ni dans une autre étape.
- Nombre et ordre des étapes dérivés de `TUNNEL_STEPS` ; clés du registre alignées sur les `key` du moteur.
- Composants de formulaire pris dans l'UI Kit via leur `index.ts` (jamais un fichier interne) ; styled-components, pas de Tailwind ; thème clair unique.
- La navigation et la validation restent la responsabilité du moteur (`useTunnelNavigation`, `validateStep`) — les vues ne les réimplémentent pas.
- TypeScript strict, pas de `any`.
- Livrer un récapitulatif : fichiers d'étape créés, contenu du registre, et confirmation que `currentStep = N` affiche bien `StepN`.
