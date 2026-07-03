# Architecture & Choix Technologiques (Clone Sofinco)

**Édition**: 2.0 Complète  
**Statut**: Architecture Exhaustive (Gap Analysis Intégrée)  
**Philosophie**: Clean Architecture Artisanale — Maîtrise totale sans boîtes noires

Ce document centralise les décisions architecturales et la stack technique retenue pour le développement du simulateur de crédit B2C et de son CRM d'administration.

---

## 🏗️ Vue d'ensemble (Architecture Hybride)

L'application repose sur une séparation claire des responsabilités :

- **Un monolithe modulaire (Laravel + React)** : Gère l'acquisition client (Tunnel B2C), la persistance des données, la sécurité et le CRM d'administration.
- **Un microservice décisionnel (Python)** : Gère exclusivement les calculs financiers complexes (Scoring, Taux d'endettement, Génération d'offres).

### Architecture Schématique
```
┌─────────────────────────────────────────────────────────────────┐
│                  Client Web (React + TypeScript)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Landing & Site Vitrine  │  Tunnel 5-Étapes │  CRM Panel   │  │
│  │  (styled-components)     │ (React Hook Form)│ (Tags, Kanban) │  │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────┬───────────────────────┘
                                          │ Inertia.js (HTTP)
┌─────────────────────────────────────────▼───────────────────────┐
│                   Laravel 13 Monolithe Modulaire                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Controllers │ Form Requests │ Models │ Services │ Queues   │  │
│  │ (Tunnel, CRM, Auth Custom)  │ (Validation)             │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL / SQLite  │  Redis Queues  │  Session Store   │  │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────────────┘
                      │ Guzzle HTTP (JSON)
┌─────────────────────▼──────────────────────────────────────────┐
│               Python Microservice (FastAPI/Flask)               │
│         ┌──────────────────────────────────────────┐            │
│         │  /score    │  /offers    │  /health      │            │
│         │  (Calculs  │  (Matrix 3) │  (Monitoring) │            │
│         │   financiers)                            │            │
│         └──────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎨 1. Front-End (React + TypeScript + Inertia.js)

L'objectif est d'avoir une interface "Crafted", typée et sur-mesure, en évitant les frameworks utilitaires (comme Tailwind) pour garder un contrôle absolu sur le Design System.

### 1.1 Stack Core

- **React 18+** : Composants fonctionnels, Hooks
- **TypeScript 5+** : Typage strict, `strict: true` dans tsconfig.json
- **Inertia.js 2.0** : Pont synchrone entre Laravel et React, pas d'API REST à construire
- **styled-components** : CSS-in-JS, scoping automatique, variables de thème

### 1.2 Architecture des Composants

#### Structure Hiérarchique (Clean Components)

```
src/
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx          # Layout global avec header/sidebar
│   │   ├── CrmLayout.tsx          # Layout CRM
│   │   └── GuestLayout.tsx        # Layout site vitrine (sans auth)
│   ├── Forms/
│   │   ├── Tunnel/
│   │   │   ├── Step1Project.tsx       # Étape 1 (Type, Montant, Durée)
│   │   │   ├── Step2Residence.tsx     # Étape 2 (Situation & Résidence)
│   │   │   ├── Step3Professional.tsx  # Étape 3 (Professionnel)
│   │   │   ├── Step4Finances.tsx      # Étape 4 (Revenus & Charges)
│   │   │   ├── Step5Identity.tsx      # Étape 5 (Identité & Contact)
│   │   │   ├── TunnelNavigation.tsx   # Boutons Précédent/Suivant
│   │   │   └── TunnelProvider.tsx     # Context React Hook Form partagé
│   ├── Common/
│   │   ├── MoneyInput.tsx          # Input numérique avec masque
│   │   ├── SelectEnum.tsx          # Select pour énums PHP
│   │   ├── ConditionalField.tsx    # Affichage conditionnel champs
│   │   └── FormError.tsx           # Affichage erreurs validation
│   ├── CRM/
│   │   ├── Kanban/
│   │   │   ├── PipelineBoard.tsx   # Vue Kanban des statuts
│   │   │   ├── DossierCard.tsx     # Carte dossier avec tags
│   │   │   └── StatusColumn.tsx    # Colonne statut
│   │   ├── DossierDetail/
│   │   │   ├── Detail360View.tsx   # Vue 360° complète
│   │   │   ├── ScoringResults.tsx  # Affichage résultats scoring
│   │   │   ├── OffersMatrix.tsx    # Matrice 3 offres
│   │   │   └── DossierActions.tsx  # Actions (Accepter/Refuser)
│   │   ├── Tags/
│   │   │   ├── TagManager.tsx      # Création/édition tags
│   │   │   ├── TagColorPicker.tsx  # Sélecteur couleur
│   │   │   ├── TagBadge.tsx        # Badge couleur avec nom
│   │   │   └── TagFilter.tsx       # Filtres multi-sélection
│   │   └── Search/
│   │       └── DossierSearch.tsx   # Barre recherche + filtres
│   └── Pages/
│       ├── Dashboard.tsx           # Accueil client/conseiller
│       ├── TunnelPage.tsx          # Page du tunnel
│       ├── SuccessPage.tsx         # Confirmation de prise en compte
│       ├── CrmDashboard.tsx        # Tableau de bord CRM
│       ├── DossierDetailPage.tsx   # Détail dossier
│       ├── LoginPage.tsx           # Connexion conseiller
│       └── SettingsPage.tsx        # Paramètres (tags)
├── hooks/
│   ├── useTunnelStep.ts            # Logique étapes du tunnel
│   ├── useFormValidation.ts        # Validation Zod + React Hook Form
│   ├── useMoneyFormat.ts           # Masques monétaires
│   └── useDossierFilters.ts        # Filtres CRM
├── services/
│   ├── api.ts                      # Client Inertia (pré-configuré)
│   ├── validation/
│   │   ├── tunnelSchemas.ts        # Schémas Zod par étape
│   │   └── errorMessages.ts        # Messages d'erreur localisés
│   └── formatting/
│       └── moneyFormatter.ts       # Parse/format monétaire
├── types/
│   ├── models.ts                   # Types mirroir des modèles PHP
│   └── api.ts                      # Types des réponses API
├── theme/
│   ├── colors.ts                   # Palette couleurs Design System
│   ├── spacing.ts                  # Échelle d'espacement
│   ├── typography.ts               # Styles typographie
│   └── GlobalStyle.tsx             # Styles globaux styled-components
└── App.tsx                         # Entry point Inertia
```

### 1.3 Gestion d'État du Tunnel (React Hook Form + Zod)

#### Pattern: Centralisation via Context + React Hook Form

```typescript
// src/context/TunnelContext.tsx
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schémas Zod par étape
const step1Schema = z.object({
  projectType: z.enum(['auto_moto', 'regroupement_credits', ...]),
  projectAmount: z.number().min(1000).max(500000),
  projectDuration: z.enum(['6', '12', '24', ...]),
});

const step2Schema = z.object({
  familySituation: z.enum(['celibataire', 'marie', 'pacs', 'divorce_veuf']),
  hasCoborrower: z.boolean(),
  housingStatus: z.enum(['fonction', 'proprietaire', 'heberge', 'locataire']),
  // ...champs supplémentaires
});

// Fusion de tous les schémas pour la validation complète
const tunnelSchema = step1Schema.merge(step2Schema).merge(step3Schema)...;

type TunnelFormData = z.infer<typeof tunnelSchema>;

// Context React
const TunnelContext = React.createContext<{
  form: UseFormReturn<TunnelFormData>;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
} | null>(null);

export function TunnelProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  
  const form = useForm<TunnelFormData>({
    resolver: zodResolver(tunnelSchema),
    mode: 'onChange', // Validation en temps réel
    defaultValues: {
      projectType: undefined,
      projectAmount: 0,
      // ...
    },
  });

  const nextStep = async () => {
    // Valider uniquement l'étape courante avant de passer à la suivante
    const valid = await form.trigger([...stepFields[currentStep]]);
    if (valid) setCurrentStep(c => c + 1);
  };

  return (
    <TunnelContext.Provider value={{ form, currentStep, nextStep, prevStep }}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </TunnelContext.Provider>
  );
}
```

#### Composant d'Entrée Monétaire avec Masque

```typescript
// src/components/Common/MoneyInput.tsx
import { Controller, useFormContext } from 'react-hook-form';
import IMask from 'imask';
import styled from 'styled-components';

interface MoneyInputProps {
  label: string;
  name: string;
  required?: boolean;
  min?: number;
}

export function MoneyInput({ label, name, required = false, min = 0 }: MoneyInputProps) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <label>{label}</label>
          <IMaskInput
            mask="$num"
            definitions={{ num: { mask: Number, thousandsSeparator: ' ' } }}
            value={field.value}
            onChange={(e) => {
              // Parse: "15 000 €" → 15000
              const parsed = parseFloat(e.currentTarget.value.replace(/\s/g, ''));
              field.onChange(parsed);
            }}
            placeholder="0 €"
          />
          {errors[name] && <ErrorText>{errors[name]?.message}</ErrorText>}
        </div>
      )}
    />
  );
}

const IMaskInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;
```

#### Affichage Conditionnel (Progressive Disclosure)

```typescript
// src/components/Common/ConditionalField.tsx
import { useFormContext, useWatch } from 'react-hook-form';

interface ConditionalFieldProps {
  condition: (formData: any) => boolean;
  children: React.ReactNode;
}

export function ConditionalField({ condition, children }: ConditionalFieldProps) {
  const { control } = useFormContext();
  const formData = useWatch({ control });

  if (!condition(formData)) return null;
  return <>{children}</>;
}

// Utilisation dans Step2:
export function Step2Residence() {
  return (
    <FormProvider {...form}>
      <SelectEnum name="familySituation" label="Situation familiale" enum={FamilySituationEnum} />
      
      <ConditionalField condition={(data) => data.familySituation === 'marie'}>
        <CheckboxField name="hasCoborrower" label="Déclarer un co-emprunteur ?" />
      </ConditionalField>

      <ConditionalField condition={(data) => data.hasCoborrower}>
        <Text>Les informations du co-emprunteur seront demandées à l'étape 5.</Text>
      </ConditionalField>
    </FormProvider>
  );
}
```

### 1.4 Interface CRM - Système de Tags et Kanban

#### Composant TagManager

```typescript
// src/components/CRM/Tags/TagManager.tsx
export function TagManager() {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [newTag, setNewTag] = React.useState({ name: '', color: '#FF0000' });

  const createTag = async () => {
    const response = await router.post('/api/tags', newTag);
    setTags([...tags, response.data]);
  };

  return (
    <TagManagerContainer>
      <h2>Gestion des Tags</h2>
      <TagForm>
        <input
          value={newTag.name}
          onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
          placeholder="Nom du tag"
        />
        <TagColorPicker
          value={newTag.color}
          onChange={(color) => setNewTag({ ...newTag, color })}
        />
        <button onClick={createTag}>Créer Tag</button>
      </TagForm>

      <TagList>
        {tags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} onDelete={() => deleteTag(tag.id)} />
        ))}
      </TagList>
    </TagManagerContainer>
  );
}
```

#### Composant Kanban avec Tags

```typescript
// src/components/CRM/Kanban/PipelineBoard.tsx
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

export function PipelineBoard({ dossiers }: { dossiers: Dossier[] }) {
  const statusColumns = ['new', 'in_progress', 'accepte', 'refused'] as const;
  const [filters, setFilters] = React.useState<{ tags: string[] }>({ tags: [] });

  const filteredDossiers = dossiers.filter((d) => {
    if (filters.tags.length === 0) return true;
    return filters.tags.some((tag) => d.tags.map((t) => t.id).includes(tag));
  });

  return (
    <div>
      <TagFilter selected={filters.tags} onSelect={(tags) => setFilters({ tags })} />

      <DragDropContext>
        <KanbanContainer>
          {statusColumns.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <StatusColumn ref={provided.innerRef} {...provided.droppableProps}>
                  <ColumnHeader>{STATUS_LABELS[status]}</ColumnHeader>
                  {filteredDossiers
                    .filter((d) => d.status === status)
                    .map((dossier, index) => (
                      <Draggable key={dossier.id} draggableId={dossier.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <DossierCard dossier={dossier} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </StatusColumn>
              )}
            </Droppable>
          ))}
        </KanbanContainer>
      </DragDropContext>
    </div>
  );
}
```

### 1.5 Installation & Configuration Frontend

#### package.json - Dépendances Frontend

```json
{
  "name": "consumer-credit-simulator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.23.0",
    "inertia.js": "^2.0.0",
    "@inertiajs/react": "^2.0.0",
    "styled-components": "^6.1.0",
    "imask": "^7.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.56.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.10.0"
  }
}
```

#### tsconfig.json - Configuration TypeScript Strict

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@types/*": ["types/*"],
      "@theme/*": ["theme/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### vite.config.ts - Optimisations Build

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'ui-vendor': ['styled-components', 'react-beautiful-dnd', 'imask'],
        },
      },
    },
  },
  server: {
    middlewareMode: true,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
});
```

---

## 🐘 2. Back-End (Laravel 13 - Orchestrateur & Métier)

Utilisation de Laravel dans sa forme la plus pure (Vanilla), sans surcouche "boîte noire", pour une maîtrise totale du cycle de vie de la requête.

### 2.1 Stack Core

- **Laravel 13** (Framework)
- **PHP 8.3+** (Langage, Type hints strict)
- **PostgreSQL ou SQLite** (Persistence)
- **Redis** (Session, Cache, Queues)
- **Guzzle HTTP Client** (Communication API Python)

### 2.2 Structure Modulaire Recommandée

#### Applicatif (App\)
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── LoginController.php              # Custom login (artisanal)
│   │   │   └── LogoutController.php
│   │   ├── Tunnel/
│   │   │   ├── TunnelController.php             # Affichage étapes
│   │   │   ├── TunnelSubmitController.php       # Orchestration soumission
│   │   │   └── TunnelSuccessController.php      # Écran succès
│   │   ├── CRM/
│   │   │   ├── DashboardController.php          # Kanban & pipeline
│   │   │   ├── DossierController.php            # Détail dossier
│   │   │   ├── DossierActionController.php      # Accepter/Refuser
│   │   │   └── TagController.php                # CRUD tags
│   │   └── Api/
│   │       └── ScoringWebhookController.php     # Webhook Python API
│   ├── Requests/
│   │   ├── Tunnel/
│   │   │   ├── StoreTunnelStep1Request.php      # Validation HTTP Étape 1
│   │   │   ├── StoreTunnelStep2Request.php      # Validation HTTP Étape 2
│   │   │   ├── StoreTunnelStep3Request.php      # Validation HTTP Étape 3
│   │   │   ├── StoreTunnelStep4Request.php      # Validation HTTP Étape 4
│   │   │   └── StoreTunnelStep5Request.php      # Validation HTTP Étape 5
│   │   └── Auth/
│   │       └── LoginRequest.php
│   └── Middleware/
│       ├── EnsureAuthenticatedAdvisor.php       # Vérifier conseiller
│       ├── SessionTimeout.php                  # Timeout session
│       └── LogApiRequests.php                   # Logger appels API
├── Models/
│   ├── Dossier.php                             # Entité dossier
│   ├── Person.php                              # Entité emprunteur/co-emprunteur
│   ├── Tag.php                                 # Entité tag
│   ├── User.php                                # Conseiller/Admin
│   └── UserRequest.php                         # Tokens async (invitations, etc.)
├── Services/
│   ├── Notification/
│   │   ├── DossierNotificationService.php      # Orchestrateur notifs
│   │   ├── ClientConfirmationMail.php          # Mailable client
│   │   └── AdvisorAlertMail.php                # Mailable conseiller
│   ├── HTTP/
│   │   └── PythonScoringApiClient.php          # Client HTTP pour API Python
│   └── Data/
│       └── MoneyFormattingService.php          # Parse "15 000 €" → 15000.00
├── Jobs/
│   ├── ProcessDossierScoringJob.php            # Job: Appel API Python
│   ├── SendClientConfirmationJob.php           # Job: Email client
│   └── SendAdvisorAlertJob.php                 # Job: Email conseiller
├── Mail/
│   ├── ClientConfirmationMail.php
│   └── AdvisorAlertMail.php
├── Events/
│   ├── DossierSubmitted.php                    # Event soumission dossier
│   ├── DossierScored.php                       # Event scoring reçu
│   └── DossierStatusChanged.php                # Event changement statut
└── Providers/
    └── AppServiceProvider.php
```

#### Logique Métier du Simulateur (Core\Simulator\)
```
core/
└── Simulator/
    ├── Enum/
    │   ├── ProjectTypeEnum.php
    │   ├── ApplicationStatusEnum.php
    │   ├── FamilySituationEnum.php
    │   ├── HousingStatusEnum.php
    │   ├── ProfessionalSectorEnum.php
    │   ├── ProfessionalJobEnum.php
    │   ├── PersonRoleEnum.php
    │   ├── CivilityEnum.php
    │   ├── BirthCountryEnum.php
    │   └── NationalityEnum.php
    ├── Tunnel/
    │   ├── TunnelOrchestrator.php               # Orchestrateur tunnel complet
    │   ├── ConditionalRulesEngine.php           # Logique affichage conditionnel
    │   ├── Step1Validator.php                   # Règles métier étape 1
    │   ├── Step2Validator.php                   # Règles métier étape 2
    │   ├── Step3Validator.php                   # Règles métier étape 3
    │   ├── Step4Validator.php                   # Règles métier étape 4
    │   ├── Step5Validator.php                   # Règles métier étape 5
    │   └── DTO/
    │       ├── TunnelData.php                   # DTO complet du tunnel
    │       ├── Step1Data.php
    │       ├── Step2Data.php
    │       ├── Step3Data.php
    │       ├── Step4Data.php
    │       ├── Step5Data.php
    │       ├── DossierData.php
    │       └── PersonData.php
    ├── Scoring/
    │   ├── ScoringRulesEngine.php               # Règles eligibilité/scoring
    │   ├── OfferMatrixGenerator.php             # Génération 3 offres
    │   └── DTO/
    │       ├── ScoringResult.php
    │       └── OfferOption.php
    ├── DataTransformer.php                      # Transformer données tunnel → modèles
    ├── Repositories/
    │   └── DossierRepository.php                # Logique persistence
    └── Exceptions/
        ├── InvalidTunnelDataException.php
        └── ScoringException.php
```

### 2.3 Authentification Personnalisée (Custom Login)

#### Philosophie: Pas de Breeze/Fortify, Construction Artisanale

```php
// app/Http/Controllers/Auth/LoginController.php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Afficher le formulaire de connexion
     */
    public function show()
    {
        return inertia('Auth/Login');
    }

    /**
     * Authentifier un conseiller
     */
    public function store(LoginRequest $request)
    {
        // Validation (voir Form Request ci-dessous)
        $credentials = $request->validated();

        // Attempt authentication
        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Régénérer la session pour éviter la fixation de session
        $request->session()->regenerate();

        return redirect()->intended(route('crm.dashboard'));
    }

    /**
     * Déconnecter un conseiller
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('login'));
    }
}

// app/Http/Requests/Auth/LoginRequest.php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
```

### 2.4 Validation Serveur-side (Form Requests par Étape)

#### Exemple: Étape 1 (Projet)

```php
// app/Http/Requests/Tunnel/StoreTunnelStep1Request.php
<?php

namespace App\Http\Requests\Tunnel;

use Core\Simulator\Enum\ProjectTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTunnelStep1Request extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Non-authentifié requis pour tunnel client
    }

    public function rules(): array
    {
        return [
            'project_type' => ['required', new Enum(ProjectTypeEnum::class)],
            'project_amount' => ['required', 'numeric', 'min:1000', 'max:500000'],
            'project_duration' => ['required', 'in:6,12,24,36,48,60,72,84,96,108,120'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_amount.min' => 'Le montant minimum est 1 000 €',
            'project_duration.in' => 'La durée sélectionnée est invalide',
        ];
    }
}
```

#### Exemple: Étape 5 (Identité) avec Règles Conditionnelles

```php
// app/Http/Requests/Tunnel/StoreTunnelStep5Request.php
<?php

namespace App\Http\Requests\Tunnel;

use Core\Simulator\Enum\FamilySituationEnum;
use Illuminate\Foundation\Http\FormRequest;

class StoreTunnelStep5Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Emprunteur
            'borrower.civility' => ['required', 'in:m,mme,autre'],
            'borrower.last_name' => ['required', 'string', 'max:100'],
            'borrower.first_name' => ['required', 'string', 'max:100'],
            'borrower.birth_date' => ['required', 'date', 'before:today', 'after:1920-01-01'],
            'borrower.phone' => ['required', 'string', 'regex:/^(\+33|0)[0-9]{9}$/'],
            'borrower.email' => ['required', 'email'],
            
            // Consentements
            'borrower.consent_data_usage' => ['required', 'boolean'],
            'borrower.consent_canvassing' => ['required', 'boolean'],
            'borrower.consent_advertising' => ['required', 'boolean'],
            
            // Co-emprunteur (conditionnel)
            'coborrower.civility' => ['required_if:has_coborrower,true', 'in:m,mme,autre'],
            'coborrower.last_name' => ['required_if:has_coborrower,true', 'string'],
            'coborrower.first_name' => ['required_if:has_coborrower,true', 'string'],
            // ... autres champs co-emprunteur
        ];
    }

    /**
     * Préparer les données validées
     */
    public function prepareForValidation(): void
    {
        // Convertir strings booléenes en bool si nécessaire
        $this->merge([
            'has_coborrower' => $this->boolean('has_coborrower'),
            'borrower' => [
                ...$this->input('borrower', []),
                'consent_data_usage' => $this->boolean('borrower.consent_data_usage'),
                'consent_canvassing' => $this->boolean('borrower.consent_canvassing'),
                'consent_advertising' => $this->boolean('borrower.consent_advertising'),
            ],
        ]);
    }
}
```

### 2.4 Énumérations du Domaine (Core\Simulator\Enum\)

#### Pattern Enum

Toutes les énumérations suivent le même pattern, inspiré du MoodEnum :
- Une méthode `label()` pour l'affichage français
- Une ou plusieurs méthodes contextuelles (`color()`, `emoji()`, etc.)
- Des helpers statiques (`choices()`, `values()`) pour les formulaires et listes

#### Exemple: ProjectTypeEnum

```php
// core/Simulator/Enum/ProjectTypeEnum.php
<?php

namespace Core\Simulator\Enum;

enum ProjectTypeEnum: string
{
    case AUTO_MOTO = 'auto_moto';
    case REGROUPEMENT_CREDITS = 'regroupement_credits';
    case TRAVAUX = 'travaux';
    case AUTRE = 'autre';
    case FAMILLE_LOISIR = 'famille_loisir';

    /**
     * Libellé français pour l'affichage
     */
    public function label(): string
    {
        return match($this) {
            self::AUTO_MOTO => 'Auto / Moto',
            self::REGROUPEMENT_CREDITS => 'Regroupement de crédits',
            self::TRAVAUX => 'Travaux',
            self::AUTRE => 'Autre',
            self::FAMILLE_LOISIR => 'Famille / Loisir',
        };
    }

    /**
     * Icône contextuelle pour le front-end
     */
    public function icon(): string
    {
        return match($this) {
            self::AUTO_MOTO => '🚗',
            self::REGROUPEMENT_CREDITS => '💳',
            self::TRAVAUX => '🔨',
            self::AUTRE => '📋',
            self::FAMILLE_LOISIR => '🏖️',
        };
    }

    /**
     * @return array<string, string> Format ['Libellé' => 'value']
     * Utile pour les formulaires Symfony/Laravel
     */
    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
```

#### Exemple: ApplicationStatusEnum

```php
// core/Simulator/Enum/ApplicationStatusEnum.php
<?php

namespace Core\Simulator\Enum;

enum ApplicationStatusEnum: string
{
    case NEW = 'new';
    case IN_PROGRESS = 'in_progress';
    case ACCEPTE = 'accepte';
    case REFUSED = 'refused';

    /**
     * Libellé français
     */
    public function label(): string
    {
        return match($this) {
            self::NEW => 'Nouveau',
            self::IN_PROGRESS => 'En cours',
            self::ACCEPTE => 'Accepté',
            self::REFUSED => 'Refusé',
        };
    }

    /**
     * Couleur Kanban pour l'affichage CRM
     */
    public function color(): string
    {
        return match($this) {
            self::NEW => 'blue',
            self::IN_PROGRESS => 'yellow',
            self::ACCEPTE => 'green',
            self::REFUSED => 'red',
        };
    }

    /**
     * Badge style pour React
     */
    public function badgeVariant(): string
    {
        return match($this) {
            self::NEW => 'info',
            self::IN_PROGRESS => 'warning',
            self::ACCEPTE => 'success',
            self::REFUSED => 'danger',
        };
    }

    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }
}
```

#### Exemple: FamilySituationEnum

```php
// core/Simulator/Enum/FamilySituationEnum.php
<?php

namespace Core\Simulator\Enum;

enum FamilySituationEnum: string
{
    case CELIBATAIRE = 'celibataire';
    case MARIE = 'marie';
    case PACS = 'pacs';
    case DIVORCE_VEUF = 'divorce_veuf';

    public function label(): string
    {
        return match($this) {
            self::CELIBATAIRE => 'Célibataire',
            self::MARIE => 'Marié(e)',
            self::PACS => 'PACS',
            self::DIVORCE_VEUF => 'Divorcé(e) / Veuf(ve)',
        };
    }

    /**
     * Requiert co-emprunteur ? (Logique métier)
     */
    public function requiresCoborrower(): bool
    {
        return match($this) {
            self::MARIE, self::PACS => true,
            default => false,
        };
    }

    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }
}
```

#### Exemple: ProfessionalSectorEnum (Enum integer)

```php
// core/Simulator/Enum/ProfessionalSectorEnum.php
<?php

namespace Core\Simulator\Enum;

enum ProfessionalSectorEnum: int
{
    case PRIVE = 10;
    case PUBLIC = 20;
    case AGRICOLE = 30;
    case INDEPENDANT = 40;
    case RETRAITE = 50;
    case ETUDIANT = 60;
    case CHOMEUR = 70;
    case INACTIF = 80;

    public function label(): string
    {
        return match($this) {
            self::PRIVE => 'Privé',
            self::PUBLIC => 'Public',
            self::AGRICOLE => 'Agricole',
            self::INDEPENDANT => 'Indépendant / Libéral',
            self::RETRAITE => 'Retraité',
            self::ETUDIANT => 'Étudiant',
            self::CHOMEUR => 'Chômeur',
            self::INACTIF => 'Inactif',
        };
    }

    /**
     * Possibilités de contrats pour ce secteur
     */
    public function allowedContracts(): array
    {
        return match($this) {
            self::PRIVE => ['cdi', 'cdd', 'interim', 'stage', 'autre'],
            self::PUBLIC => ['cdi', 'cdd', 'interim'],
            self::AGRICOLE => ['cdi', 'cdd', 'autre'],
            self::INDEPENDANT => ['autre'],
            self::RETRAITE => [],
            self::ETUDIANT => ['stage', 'autre'],
            self::CHOMEUR => [],
            self::INACTIF => [],
        };
    }

    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
```

#### Utilisation des Enums dans les Modèles

```php
// app/Models/Dossier.php
<?php

namespace App\Models;

use Core\Simulator\Enum\ProjectTypeEnum;
use Core\Simulator\Enum\ApplicationStatusEnum;

class Dossier extends Model
{
    protected $casts = [
        'project_type' => ProjectTypeEnum::class,
        'status' => ApplicationStatusEnum::class,
    ];

    // Dans les contrôleurs / formulaires
    public function getProjectLabel(): string
    {
        return $this->project_type?->label() ?? 'N/A';
    }

    public function getStatusColor(): string
    {
        return $this->status->color();
    }
}
```

#### Utilisation dans React/TypeScript

```typescript
// src/components/DossierCard.tsx
import { dossier } from '@types';

export function DossierCard({ dossier }: { dossier: Dossier }) {
  return (
    <Card>
      <Badge variant={getStatusVariant(dossier.status)}>
        {getStatusLabel(dossier.status)}
      </Badge>
      <div>
        {getProjectIcon(dossier.project_type)} {getProjectLabel(dossier.project_type)}
      </div>
    </Card>
  );
}

// Mapping frontend (reçu via Inertia du contrôleur)
const statusLabels = {
  new: 'Nouveau',
  in_progress: 'En cours',
  accepte: 'Accepté',
  refused: 'Refusé',
};

const statusColors = {
  new: 'blue',
  in_progress: 'yellow',
  accepte: 'green',
  refused: 'red',
};
```

### 2.5 Services de Nettoyage Données

#### Service de Formatting Monétaire

```php
// app/Services/Data/MoneyFormattingService.php
<?php

namespace App\Services\Data;

class MoneyFormattingService
{
    /**
     * Parse une chaîne formatée en monnaie vers décimal brut
     * 
     * @param string $input Ex: "15 000 €" ou "15000.50"
     * @return float
     */
    public function parse(string $input): float
    {
        // Supprimer les symboles monétaires
        $cleaned = preg_replace('/[^\d.,]/', '', $input);
        
        // Remplacer les espaces (séparateurs de milliers) et gérer décimales
        $normalized = str_replace(' ', '', $cleaned);
        
        // Déterminer le séparateur décimal (. ou ,)
        $decimalPos = max(strrpos($normalized, '.'), strrpos($normalized, ','));
        
        if ($decimalPos !== false) {
            $separator = $normalized[$decimalPos];
            // Remplacer tous les séparateurs de milliers par vide
            $integer = substr($normalized, 0, $decimalPos);
            $integer = str_replace(($separator === '.' ? ',' : '.'), '', $integer);
            $decimal = substr($normalized, $decimalPos + 1);
            $normalized = $integer . '.' . $decimal;
        }
        
        return (float) $normalized;
    }

    /**
     * Formate un nombre en monnaie lisible
     * 
     * @param float $amount
     * @param string $locale Ex: 'fr_FR'
     * @return string
     */
    public function format(float $amount, string $locale = 'fr_FR'): string
    {
        $formatter = numfmt_create($locale, \NumberFormatter::CURRENCY);
        return numfmt_format_currency($formatter, $amount, 'EUR');
    }
}

// Utilisation dans un contrôleur
class TunnelSubmitController extends Controller
{
    public function __construct(
        private MoneyFormattingService $moneyService,
        private DossierService $dossierService,
    ) {}

    public function store(StoreTunnelStep5Request $request)
    {
        $validated = $request->validated();

        // Parser les montants avant insertion
        $validated['project_amount'] = $this->moneyService->parse(
            $validated['project_amount']
        );
        $validated['income_net_monthly'] = $this->moneyService->parse(
            $validated['income_net_monthly']
        );
        // ... Parser tous les montants

        // Créer le dossier
        $dossier = $this->dossierService->createFromTunnelData($validated);

        return inertia('Tunnel/Success', ['dossier' => $dossier]);
    }
}
```

### 2.6 Modèles Eloquent & Relations

```php
// app/Models/Dossier.php
<?php

namespace App\Models;

use Core\Simulator\Enum\ApplicationStatusEnum;
use Core\Simulator\Enum\ProjectTypeEnum;
use Core\Simulator\Enum\FamilySituationEnum;
use Core\Simulator\Enum\HousingStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Dossier extends Model
{
    protected $fillable = [
        'project_type', 'project_amount', 'project_duration',
        'family_situation', 'has_coborrower', 'housing_status',
        'income_net_monthly', 'income_rental', 'income_allowance', 'income_other',
        'charge_housing', 'charge_mortgage_remaining', 'housing_property_value',
        'has_active_consumer_credit', 'charge_consumer_credit_monthly',
        'charge_consumer_credit_remaining', 'charge_other', 'status',
    ];

    protected $casts = [
        'project_type' => ProjectTypeEnum::class,
        'family_situation' => FamilySituationEnum::class,
        'housing_status' => HousingStatusEnum::class,
        'status' => ApplicationStatusEnum::class,
        'project_amount' => 'decimal:2',
        'income_net_monthly' => 'decimal:2',
        'has_coborrower' => 'boolean',
        'has_active_consumer_credit' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function persons(): HasMany
    {
        return $this->hasMany(Person::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'dossier_tags');
    }

    public function borrower(): Person
    {
        return $this->persons()->where('role', PersonRoleEnum::BORROWER)->firstOrFail();
    }

    public function coborrower(): ?Person
    {
        return $this->persons()->where('role', PersonRoleEnum::COBORROWER)->first();
    }

    // Accessors
    public function getTotalIncomeAttribute(): float
    {
        return $this->income_net_monthly
            + ($this->income_rental ?? 0)
            + ($this->income_allowance ?? 0)
            + ($this->income_other ?? 0);
    }

    public function getTotalChargesAttribute(): float
    {
        return ($this->charge_housing ?? 0)
            + ($this->charge_consumer_credit_monthly ?? 0)
            + ($this->charge_other ?? 0);
    }
}

// app/Models/Person.php
<?php

namespace App\Models;

use Core\Simulator\Enum\PersonRoleEnum;
use Core\Simulator\Enum\ProfessionalSectorEnum;
use Core\Simulator\Enum\ProfessionalJobEnum;
use Core\Simulator\Enum\CivilityEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Person extends Model
{
    protected $fillable = [
        'dossier_id', 'role', 'civility', 'last_name', 'maiden_name',
        'first_name', 'birth_date', 'birthCountry', 'nationality',
        'professional_sector', 'professional_job', 'employment_contract',
        'probation_period_ended', 'professional_situation_date',
        'phone', 'email', 'consent_data_usage', 'consent_canvassing',
        'consent_advertising',
    ];

    protected $casts = [
        'role' => PersonRoleEnum::class,
        'civility' => CivilityEnum::class,
        'professional_sector' => ProfessionalSectorEnum::class,
        'professional_job' => ProfessionalJobEnum::class,
        'birth_date' => 'date',
        'consent_data_usage' => 'boolean',
        'consent_canvassing' => 'boolean',
        'consent_advertising' => 'boolean',
    ];

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }
}

// app/Models/Tag.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    protected $fillable = ['name', 'color', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dossiers(): BelongsToMany
    {
        return $this->belongsToMany(Dossier::class, 'dossier_tags');
    }
}
```

### 2.7 Service d'Appel à l'API Python (HTTP Client)

#### Client HTTP (App\Services\HTTP\)

```php
// app/Services/HTTP/PythonScoringApiClient.php
<?php

namespace App\Services\HTTP;

use Core\Simulator\Scoring\DTO\ScoringResult;
use App\Models\Dossier;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class PythonScoringApiClient
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('services.scoring.base_url'),
            'timeout' => 30,
            'connect_timeout' => 5,
        ]);
    }

    /**
     * Appeler l'API Python avec retry logic
     */
    public function score(Dossier $dossier): ScoringResult
    {
        $payload = $this->buildPayload($dossier);

        $maxAttempts = 3;
        $attempt = 0;
        $lastException = null;

        while ($attempt < $maxAttempts) {
            try {
                $response = $this->client->post('/score', [
                    'json' => $payload,
                    'headers' => [
                        'Authorization' => 'Bearer ' . config('services.scoring.api_key'),
                    ],
                ]);

                $data = json_decode($response->getBody(), true);

                Log::info('Scoring request successful', [
                    'dossier_id' => $dossier->id,
                    'status_code' => $response->getStatusCode(),
                ]);

                return $this->parseResponse($data);
            } catch (RequestException $e) {
                $lastException = $e;
                $attempt++;

                Log::warning("Scoring API attempt {$attempt} failed", [
                    'dossier_id' => $dossier->id,
                    'error' => $e->getMessage(),
                ]);

                if ($attempt < $maxAttempts) {
                    // Backoff exponentiel: 1s, 2s, 4s
                    sleep(2 ** ($attempt - 1));
                }
            }
        }

        Log::error('Scoring API failed after all retries', [
            'dossier_id' => $dossier->id,
            'error' => $lastException->getMessage(),
        ]);

        throw $lastException;
    }

    /**
     * Construire le payload JSON pour l'API
     */
    private function buildPayload(Dossier $dossier): array
    {
        return [
            'dossier_id' => $dossier->id,
            'project_amount' => (float) $dossier->project_amount,
            'project_duration' => (int) $dossier->project_duration,
            'total_income' => (float) $dossier->total_income,
            'total_charges' => (float) $dossier->total_charges,
            'family_situation' => $dossier->family_situation->value,
            'housing_status' => $dossier->housing_status->value,
            'professional_sector' => $dossier->borrower->professional_sector->value,
        ];
    }

    /**
     * Parser la réponse Python en objet ScoringResult
     */
    public function parseResponse(array $response): ScoringResult
    {
        return new ScoringResult(
            riskScore: $response['risk_score'],
            riskLevel: $response['risk_level'],
            debtRatio: $response['debt_ratio'],
            remainingIncome: $response['remaining_income'],
            isEligible: $response['is_eligible'],
            offers: $response['offers'] ?? [],
            message: $response['message'] ?? '',
        );
    }
}
```

#### Orchestrateur Métier (Core\Simulator\Scoring\)

```php
// core/Simulator/Scoring/ScoringRulesEngine.php
<?php

namespace Core\Simulator\Scoring;

use Core\Simulator\Scoring\DTO\ScoringResult;

/**
 * Logique métier du scoring: règles eligibilité, calculs, etc.
 * N'effectue pas l'appel HTTP (délégué au Client)
 */
class ScoringRulesEngine
{
    /**
     * Vérifier l'éligibilité de base avant appel API
     */
    public function isEligibleForScoring(array $dossierData): bool
    {
        // Vérifications métier
        $totalCharges = $dossierData['total_charges'] ?? 0;
        $totalIncome = $dossierData['total_income'] ?? 0;
        $projectAmount = $dossierData['project_amount'] ?? 0;

        // Règles simples
        if ($totalIncome <= 0) {
            return false;
        }

        if ($projectAmount < 1000) {
            return false;
        }

        // Autres vérifications métier...
        return true;
    }

    /**
     * Calculer le score de risque basé sur les règles métier
     */
    public function calculateRiskLevel(float $debtRatio, array $context): string
    {
        // Logique propriétaire du scoring (peut être différente de l'API Python)
        if ($debtRatio < 20) {
            return 'A';
        } elseif ($debtRatio < 30) {
            return 'B';
        } elseif ($debtRatio < 35) {
            return 'C';
        } elseif ($debtRatio < 40) {
            return 'D';
        }
        return 'E';
    }
}

// core/Simulator/Scoring/DTO/ScoringResult.php
<?php

namespace Core\Simulator\Scoring\DTO;

class ScoringResult
{
    public function __construct(
        public float $riskScore,
        public string $riskLevel, // 'A', 'B', 'C', 'D', 'E'
        public float $debtRatio,
        public float $remainingIncome,
        public bool $isEligible,
        public array $offers = [], // 3 offres [short, balanced, flexible]
        public string $message = '',
    ) {}
}
```

### 2.8 Jobs de File d'Attente (Queues)

```php
// app/Jobs/ProcessDossierScoringJob.php
<?php

namespace App\Jobs;

use App\Models\Dossier;
use App\Services\HTTP\PythonScoringApiClient;
use App\Events\DossierScored;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessDossierScoringJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private Dossier $dossier)
    {
        // Configurer la queue priority
        $this->onQueue('high');
        $this->delay(now()->addSeconds(2)); // Délai de 2s avant traitement
    }

    /**
     * Exécuter le job
     */
    public function handle(PythonScoringApiClient $scoringClient)
    {
        try {
            // Appeler l'API Python via le client HTTP
            $result = $scoringClient->score($this->dossier);

            // Sauvegarder les résultats
            $this->dossier->update([
                'scoring_result' => json_encode($result),
                'status' => $result->isEligible ? 'in_progress' : 'refused',
            ]);

            // Notifier le conseiller si éligible
            if ($result->isEligible) {
                SendAdvisorAlertJob::dispatch($this->dossier);
            }

            // Dispatcher un événement
            event(new DossierScored($this->dossier, $result));

            Log::info('Dossier scoring completed', [
                'dossier_id' => $this->dossier->id,
                'risk_level' => $result->riskLevel,
            ]);

        } catch (\Exception $e) {
            Log::error('Dossier scoring failed', [
                'dossier_id' => $this->dossier->id,
                'error' => $e->getMessage(),
            ]);

            // Relancer le job après 1 minute si la tentative échoue
            $this->release(60);
        }
    }

    /**
     * Gérer l'échec du job après tous les retries
     */
    public function failed(\Throwable $exception)
    {
        Log::critical('Dossier scoring job permanently failed', [
            'dossier_id' => $this->dossier->id,
            'exception' => $exception->getMessage(),
        ]);

        // Notifier administrateur
        // Alerter le client que son dossier n'a pas pu être traité
    }
}

// app/Jobs/SendClientConfirmationJob.php
<?php

namespace App\Jobs;

use App\Models\Dossier;
use App\Mail\ClientConfirmationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class SendClientConfirmationJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(private Dossier $dossier)
    {
        $this->onQueue('emails');
    }

    public function handle()
    {
        Mail::to($this->dossier->borrower->email)
            ->send(new ClientConfirmationMail($this->dossier));
    }
}
```

### 2.9 Notifications & Mails

```php
// app/Mail/ClientConfirmationMail.php
<?php

namespace App\Mail;

use App\Models\Dossier;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientConfirmationMail extends Mailable
{
    use SerializesModels;

    public function __construct(private Dossier $dossier) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation de votre demande de crédit',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client-confirmation',
            with: [
                'dossierNumber' => $this->dossier->id,
                'borrowerName' => $this->dossier->borrower->first_name,
                'projectAmount' => $this->dossier->project_amount,
            ],
        );
    }
}

// app/Mail/AdvisorAlertMail.php
<?php

namespace App\Mail;

use App\Models\Dossier;
use Illuminate\Mail\Mailable;

class AdvisorAlertMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        private Dossier $dossier,
        private array $scoringResult,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nouveau dossier à traiter - #{$this->dossier->id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.advisor-alert',
            with: [
                'dossier' => $this->dossier,
                'scoring' => $this->scoringResult,
                'dossierUrl' => route('crm.dossier.show', $this->dossier),
            ],
        );
    }
}
```

### 2.10 Configuration des Queues & Email

#### config/queue.php

```php
return [
    'default' => env('QUEUE_CONNECTION', 'database'),

    'connections' => [
        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false, // Executer après commit DB
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
        ],
    ],

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],
];
```

#### config/mail.php

```php
return [
    'default' => env('MAIL_DRIVER', 'smtp'),

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.mailtrap.io'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'auth_mode' => null,
        ],

        'mailgun' => [
            'transport' => 'mailgun',
            'secret' => env('MAILGUN_SECRET'),
            'domain' => env('MAILGUN_DOMAIN'),
            'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        ],
    ],

    'from' => [
        'name' => env('MAIL_FROM_NAME', 'Simulateur de Crédit'),
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@credit-simulator.local'),
    ],
];
```

---

## 🗄️ 3. Base de Données & Modélisation

Une architecture relationnelle normalisée pour éviter la redondance et garantir l'intégrité des données financières.

### 3.1 Moteur & Configuration

- **Développement**: SQLite (fichier `database.sqlite`, rapide, sans dépendances)
- **Staging/Production**: PostgreSQL 15+ (performant, ACID compliant)
- **Migrations**: Laravel Migrations (versioning DBChanges)
- **Seeders**: DatabaseSeeder pour données de test

### 3.2 Schéma Relationnel

Voir [db.md](db.md) pour la documentation complète.

### 3.3 Migrations Clés

#### Migration: Create Dossiers Table

```php
// database/migrations/2026_07_01_094836_create_dossiers_table.php
<?php

use Core\Simulator\Enum\ProjectTypeEnum;
use Core\Simulator\Enum\ApplicationStatusEnum;
use Core\Simulator\Enum\FamilySituationEnum;
use Core\Simulator\Enum\HousingStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossiers', function (Blueprint $table) {
            $table->id();

            // Projet
            $table->enum('project_type', [
                ProjectTypeEnum::AUTO_MOTO->value,
                ProjectTypeEnum::REGROUPEMENT_CREDITS->value,
                ProjectTypeEnum::TRAVAUX->value,
                ProjectTypeEnum::AUTRE->value,
                ProjectTypeEnum::FAMILLE_LOISIR->value,
            ]);
            $table->decimal('project_amount', 10, 2);
            $table->unsignedSmallInteger('project_duration');

            // Situation & Résidence
            $table->enum('family_situation', [
                FamilySituationEnum::CELIBATAIRE->value,
                FamilySituationEnum::MARIE->value,
                FamilySituationEnum::PACS->value,
                FamilySituationEnum::DIVORCE_VEUF->value,
            ]);
            $table->string('family_situation_year', 4)->nullable();
            $table->boolean('has_coborrower')->default(false);
            $table->enum('housing_status', [
                HousingStatusEnum::FONCTION->value,
                HousingStatusEnum::PROPRIETAIRE->value,
                HousingStatusEnum::HEBERGE->value,
                HousingStatusEnum::LOCATAIRE->value,
            ]);
            $table->string('housing_status_year', 4)->nullable();

            // Finances - Revenus
            $table->decimal('income_net_monthly', 10, 2);
            $table->decimal('income_rental', 10, 2)->nullable();
            $table->decimal('income_allowance', 10, 2)->nullable();
            $table->decimal('income_other', 10, 2)->nullable();

            // Finances - Charges
            $table->decimal('charge_housing', 10, 2)->nullable();
            $table->decimal('charge_mortgage_remaining', 10, 2)->nullable();
            $table->decimal('housing_property_value', 10, 2)->nullable();
            $table->boolean('has_active_consumer_credit')->default(false);
            $table->decimal('charge_consumer_credit_monthly', 10, 2)->nullable();
            $table->decimal('charge_consumer_credit_remaining', 10, 2)->nullable();
            $table->decimal('charge_other', 10, 2)->nullable();

            // Scoring Results (JSON)
            $table->json('scoring_result')->nullable();

            // Status CRM
            $table->enum('status', [
                ApplicationStatusEnum::NEW->value,
                ApplicationStatusEnum::IN_PROGRESS->value,
                ApplicationStatusEnum::ACCEPTE->value,
                ApplicationStatusEnum::REFUSED->value,
            ])->default(ApplicationStatusEnum::NEW->value);

            // Timestamps
            $table->timestamps();

            // Indexes pour performances
            $table->index('status');
            $table->index('created_at');
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};
```

#### Migration: Create Persons Table

```php
// database/migrations/2026_07_01_094837_create_persons_table.php
<?php

use Core\Simulator\Enum\PersonRoleEnum;
use Core\Simulator\Enum\CivilityEnum;
use Core\Simulator\Enum\BirthCountryEnum;
use Core\Simulator\Enum\NationalityEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();

            // Rôle
            $table->enum('role', [
                PersonRoleEnum::BORROWER->value,
                PersonRoleEnum::COBORROWER->value,
            ]);

            // État civil
            $table->enum('civility', [
                CivilityEnum::M->value,
                CivilityEnum::MME->value,
                CivilityEnum::AUTRE->value,
            ]);
            $table->string('last_name');
            $table->string('maiden_name')->nullable();
            $table->string('first_name');
            $table->date('birth_date');
            $table->enum('birthCountry', [
                BirthCountryEnum::FRANCE->value,
                BirthCountryEnum::UE->value,
                BirthCountryEnum::HORS_UE->value,
            ])->nullable();
            $table->enum('nationality', [
                NationalityEnum::FRANCE->value,
                NationalityEnum::UE->value,
                NationalityEnum::HORS_UE->value,
            ])->nullable();

            // Professionnel
            $table->unsignedSmallInteger('professional_sector');
            $table->unsignedSmallInteger('professional_job');
            $table->enum('employment_contract', [
                'cdi', 'stage', 'interim', 'cdd', 'autre'
            ])->nullable();
            $table->boolean('probation_period_ended')->nullable();
            $table->string('professional_situation_date'); // Format: MM/AAAA

            // Contact & Consentements
            $table->string('phone');
            $table->string('email');
            $table->boolean('consent_data_usage')->default(false);
            $table->boolean('consent_canvassing')->default(false);
            $table->boolean('consent_advertising')->default(false);

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index('dossier_id');
            $table->index('role');
            $table->unique(['dossier_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
```

#### Migration: Create Tags Table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('color', 7); // Hex color: #RRGGBB
            $table->timestamps();

            $table->unique(['user_id', 'name']);
        });

        Schema::create('dossier_tags', function (Blueprint $table) {
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['dossier_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossier_tags');
        Schema::dropIfExists('tags');
    }
};
```

---

## 🐍 4. Microservice Scoring (API Python)

Un service "Stateless" dédié à l'intelligence algorithmique.

### 4.1 Choix Technologiques

- **Framework**: FastAPI ou Flask
- **Langage**: Python 3.11+
- **Conteneurisation**: Docker
- **API Format**: REST/JSON

### 4.2 Endpoints Principaux

#### POST /score

**Reçoit**: Payload dossier complet

```json
{
  "dossier_id": 123,
  "project_amount": 15000.00,
  "project_duration": 60,
  "total_income": 3500.00,
  "total_charges": 1200.00,
  "family_situation": "marie",
  "housing_status": "locataire",
  "professional_sector": "10",
  "birth_date": "1985-06-15"
}
```

**Retourne**: Résultats scoring

```json
{
  "dossier_id": 123,
  "risk_score": 78,
  "risk_level": "B",
  "debt_ratio": 34.2,
  "remaining_income": 2300.00,
  "is_eligible": true,
  "message": "Dossier accepté",
  "offers": [
    {
      "name": "short",
      "duration": 36,
      "monthly": 425.50,
      "total_cost": 15318.00,
      "taeg": 2.12
    },
    {
      "name": "balanced",
      "duration": 60,
      "monthly": 260.30,
      "total_cost": 15618.00,
      "taeg": 2.45
    },
    {
      "name": "flexible",
      "duration": 84,
      "monthly": 190.50,
      "total_cost": 16002.00,
      "taeg": 2.78
    }
  ]
}
```

#### GET /health

**Utilisé par**: Kubernetes probes, monitoring

### 4.3 Exemple Implémentation (FastAPI)

```python
# scoring_api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
import logging

app = FastAPI(title="Scoring API", version="1.0.0")
logger = logging.getLogger(__name__)

class ScoringRequest(BaseModel):
    dossier_id: int
    project_amount: float = Field(gt=0)
    project_duration: int = Field(ge=6, le=120)
    total_income: float = Field(ge=0)
    total_charges: float = Field(ge=0)
    family_situation: str
    housing_status: str
    professional_sector: str

class OfferResponse(BaseModel):
    name: str  # 'short' | 'balanced' | 'flexible'
    duration: int
    monthly: float
    total_cost: float
    taeg: float

class ScoringResponse(BaseModel):
    dossier_id: int
    risk_score: float
    risk_level: str  # 'A' | 'B' | 'C' | 'D' | 'E'
    debt_ratio: float
    remaining_income: float
    is_eligible: bool
    message: str
    offers: List[OfferResponse] = []

class ScoringService:
    @staticmethod
    def calculate_debt_ratio(charges: float, income: float) -> float:
        if income == 0:
            return 100.0
        return (charges / income) * 100

    @staticmethod
    def calculate_remaining_income(income: float, charges: float) -> float:
        return income - charges

    @staticmethod
    def calculate_risk_level(debt_ratio: float, credit_duration: int) -> str:
        """
        Scoring simplifié basé sur taux d'endettement
        """
        if debt_ratio < 20:
            return 'A'
        elif debt_ratio < 30:
            return 'B'
        elif debt_ratio < 35:
            return 'C'
        elif debt_ratio < 40:
            return 'D'
        else:
            return 'E'

    @staticmethod
    def generate_offers(
        project_amount: float,
        debt_ratio: float,
        risk_level: str
    ) -> List[OfferResponse]:
        """
        Génère 3 offres commerciales
        """
        offers = []

        # Option Courte
        offers.append(OfferResponse(
            name='short',
            duration=36,
            monthly=project_amount / 36 * 1.015,  # +1.5% frais
            total_cost=project_amount * 1.045,    # +4.5% total
            taeg=2.12
        ))

        # Option Équilibrée
        offers.append(OfferResponse(
            name='balanced',
            duration=60,
            monthly=project_amount / 60 * 1.021,  # +2.1% frais
            total_cost=project_amount * 1.063,    # +6.3% total
            taeg=2.45
        ))

        # Option Souple
        offers.append(OfferResponse(
            name='flexible',
            duration=84,
            monthly=project_amount / 84 * 1.027,  # +2.7% frais
            total_cost=project_amount * 1.069,    # +6.9% total
            taeg=2.78
        ))

        return offers

@app.post('/score', response_model=ScoringResponse)
async def score_dossier(request: ScoringRequest):
    """
    Endpoint principal de scoring
    """
    try:
        # Calculs
        debt_ratio = ScoringService.calculate_debt_ratio(
            request.total_charges,
            request.total_income
        )
        remaining_income = ScoringService.calculate_remaining_income(
            request.total_income,
            request.total_charges
        )
        risk_level = ScoringService.calculate_risk_level(
            debt_ratio,
            request.project_duration
        )

        # Eligibilité
        is_eligible = (
            debt_ratio < 35 and
            remaining_income > 500 and
            risk_level != 'E'
        )

        # Offres
        offers = ScoringService.generate_offers(
            request.project_amount,
            debt_ratio,
            risk_level
        ) if is_eligible else []

        logger.info(f"Dossier {request.dossier_id} scored", extra={
            'debt_ratio': debt_ratio,
            'risk_level': risk_level,
            'eligible': is_eligible
        })

        return ScoringResponse(
            dossier_id=request.dossier_id,
            risk_score=int(debt_ratio * 100 / 50),  # 0-200 scale
            risk_level=risk_level,
            debt_ratio=debt_ratio,
            remaining_income=remaining_income,
            is_eligible=is_eligible,
            message='Dossier accepté' if is_eligible else 'Dossier refusé',
            offers=offers
        )

    except Exception as e:
        logger.error(f"Scoring error for dossier {request.dossier_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Scoring failed")

@app.get('/health')
async def health_check():
    """
    Health check pour Kubernetes/Monitoring
    """
    return {'status': 'healthy', 'version': '1.0.0'}
```

---

## ✅ 5. Stratégie de Tests

### 5.1 Backend (PHP - Pest)

#### Configuration Pest

```php
// tests/Pest.php
<?php

use Tests\TestCase;

uses(TestCase::class)->in('Feature', 'Unit', 'Database');

// Helpers globaux
function createDossierWithPerson()
{
    $dossier = \App\Models\Dossier::factory()->create();
    \App\Models\Person::factory()->create([
        'dossier_id' => $dossier->id,
        'role' => \App\Enums\PersonRoleEnum::BORROWER,
    ]);
    return $dossier;
}

function loginAdvisor()
{
    $user = \App\Models\User::factory()->create();
    actingAs($user);
    return $user;
}
```

#### Tests Fonctionnels (Feature)

```php
// tests/Feature/TunnelSubmissionTest.php
<?php

use App\Models\Dossier;
use App\Jobs\ProcessDossierScoringJob;
use Illuminate\Support\Facades\Queue;

it('submits a complete tunnel and queues scoring', function () {
    Queue::fake();

    $response = $this->post('/tunnel/submit', [
        'project_type' => 'auto_moto',
        'project_amount' => '15 000',
        'project_duration' => '60',
        'family_situation' => 'marie',
        'has_coborrower' => true,
        // ... tous les champs
    ]);

    $response->assertRedirect(route('tunnel.success'));
    expect(Dossier::count())->toBe(1);
    Queue::assertPushed(ProcessDossierScoringJob::class);
});

it('validates money formatting', function () {
    $response = $this->post('/tunnel/submit', [
        'project_amount' => 'invalid',
        // ...
    ]);

    $response->assertSessionHasErrors('project_amount');
});

it('requires conditional co-borrower data when married', function () {
    $response = $this->post('/tunnel/submit', [
        'family_situation' => 'marie',
        'has_coborrower' => true,
        'coborrower' => null, // Missing
        // ...
    ]);

    $response->assertSessionHasErrors('coborrower.first_name');
});
```

#### Tests Unitaires

```php
// tests/Unit/MoneyFormattingServiceTest.php
<?php

use App\Services\Data\MoneyFormattingService;

$service = new MoneyFormattingService();

it('parses french formatted money', function () use ($service) {
    expect($service->parse('15 000 €'))->toBe(15000.00);
    expect($service->parse('1 234,56 €'))->toBe(1234.56);
    expect($service->parse('100'))->toBe(100.00);
});

it('handles edge cases', function () use ($service) {
    expect($service->parse('0 €'))->toBe(0.00);
    expect($service->parse('999 999 999,99'))->toBe(999999999.99);
});

// tests/Unit/Simulator/Scoring/ScoringRulesEngineTest.php
<?php

use Core\Simulator\Scoring\ScoringRulesEngine;

$engine = new ScoringRulesEngine();

it('determines eligibility based on debt ratio', function () use ($engine) {
    $riskLevel = $engine->calculateRiskLevel(25.0, []);
    expect($riskLevel)->toBe('B');

    $riskLevel = $engine->calculateRiskLevel(45.0, []);
    expect($riskLevel)->toBe('E');
});
```

### 5.2 Frontend (TypeScript/React - Vitest)

#### Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.stories.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### Tests Composants

```typescript
// src/components/Common/__tests__/MoneyInput.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { MoneyInput } from '../MoneyInput';

function TestWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { amount: 0 } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

it('formats input with thousand separators', async () => {
  render(
    <TestWrapper>
      <MoneyInput name="amount" label="Amount" />
    </TestWrapper>
  );

  const input = screen.getByDisplayValue('0 €');
  await userEvent.type(input, '15000');
  
  expect(input).toHaveValue('15 000 €');
});

it('parses formatted value correctly', async () => {
  const { form } = renderWithForm(<MoneyInput name="amount" label="Amount" />);
  
  const input = screen.getByRole('textbox');
  await userEvent.type(input, '15 000 €');
  
  expect(form.getValues('amount')).toBe(15000);
});
```

#### Tests de Validation (Zod)

```typescript
// src/services/validation/__tests__/tunnelSchemas.test.ts
import { step1Schema } from '../tunnelSchemas';

describe('Tunnel Validation Schemas', () => {
  it('validates step 1 data correctly', () => {
    const validData = {
      projectType: 'auto_moto',
      projectAmount: 15000,
      projectDuration: '60',
    };

    const result = step1Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid project amount', () => {
    const invalidData = {
      projectType: 'auto_moto',
      projectAmount: 500, // < min 1000
      projectDuration: '60',
    };

    const result = step1Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain('minimum');
  });
});
```

### 5.3 Couverture Cible

- **Backend**: 70% minimum (Controllers, Services, Models)
- **Frontend**: 60% minimum (Components, Hooks, Utilities)
- **Exclusions**: Views, migrations, fixtures

---

## 🚀 6. CI/CD & Déploiement

### 6.1 GitHub Actions Workflow

```yaml
# .github/workflows/test-and-deploy.yml
name: Test & Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: secret
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      # PHP Backend
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_pgsql, redis
          coverage: xdebug

      - name: Cache composer
        uses: actions/cache@v3
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}

      - name: Install dependencies
        run: composer install --no-interaction --prefer-dist

      - name: Copy .env.testing
        run: cp .env.example .env.testing

      - name: Generate key
        run: php artisan key:generate --env=testing

      - name: Run migrations
        run: php artisan migrate --env=testing
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test
          DB_USERNAME: postgres
          DB_PASSWORD: secret

      - name: Run Pest tests
        run: php artisan test --coverage --min=70
        env:
          DB_CONNECTION: pgsql
          REDIS_HOST: localhost

      - name: Run Pint linter
        run: ./vendor/bin/pint --test

      # Node Frontend
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Vitest
        run: npm run test:coverage

      - name: Build frontend
        run: npm run build

      - name: Run ESLint
        run: npm run lint

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Staging
        env:
          DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}
          DEPLOY_HOST: staging.credit-simulator.local
          DEPLOY_USER: deploy
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts

          ssh $DEPLOY_USER@$DEPLOY_HOST << 'DEPLOY'
            cd /var/www/credit-simulator
            git pull origin staging
            composer install --no-dev
            npm ci && npm run build
            php artisan migrate --force
            php artisan cache:clear
          DEPLOY

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Production
        env:
          DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
          DEPLOY_HOST: api.credit-simulator.com
          DEPLOY_USER: deploy
        run: |
          # Configuration similaire à staging
          # Avec vérifications supplémentaires
          ssh $DEPLOY_USER@$DEPLOY_HOST << 'DEPLOY'
            cd /var/www/credit-simulator
            git pull origin main
            composer install --no-dev --optimize-autoloader
            npm ci && npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            php artisan queue:restart
          DEPLOY
```

### 6.2 Stratégies de Déploiement

| Environnement | DB | Queue | Email | Scoring API |
|---|---|---|---|---|
| **Développement** | SQLite | Sync | Mailtrap | Mock |
| **Staging** | PostgreSQL | Redis | Mailgun | Conteneur Python |
| **Production** | PostgreSQL RDS | Redis Cluster | Mailgun | Python/Railway |

### 6.3 Dockerfile (Python API)

```dockerfile
# scoring_api/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "scoring_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔒 7. Sécurité & Protection

### 7.1 CORS & CSRF

```php
// app/Http/Middleware/SetSecurityHeaders.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetSecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // CORS (Inertia sur même domaine)
        $response->header('Access-Control-Allow-Origin', env('FRONTEND_URL'));
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Security Headers
        $response->header('X-Content-Type-Options', 'nosniff');
        $response->header('X-Frame-Options', 'DENY');
        $response->header('X-XSS-Protection', '1; mode=block');
        $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
```

### 7.2 Rate Limiting

```php
// routes/web.php
Route::post('/api/scoring', ScoringWebhookController::class)
    ->middleware('throttle:10,1') // 10 requêtes/minute
    ->name('api.scoring.webhook');

Route::post('/login', LoginController::class . '@store')
    ->middleware('throttle:5,1'); // 5 tentatives/minute
```

### 7.3 Validation d'Authentification

```php
// app/Http/Middleware/EnsureAuthenticatedAdvisor.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAuthenticatedAdvisor
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->is_advisor) {
            abort(403, 'Accès refusé');
        }

        // Renouveler la session pour prévenir la fixation
        session()->regenerate();

        return $next($request);
    }
}
```

---

## 📊 8. Logging & Monitoring

### 8.1 Configuration Logging

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'sentry'],
        'ignore_exceptions' => false,
    ],

    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],

    'sentry' => [
        'driver' => 'sentry',
        'level' => 'error',
    ],
],
```

### 8.2 Logging des Appels API

```php
// app/Http/Middleware/LogApiRequests.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle($request, Closure $next)
    {
        $start = now();

        $response = $next($request);

        Log::info('API Request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'duration_ms' => now()->diffInMilliseconds($start),
            'ip' => $request->ip(),
        ]);

        return $response;
    }
}
```

---

## 🛠️ 9. Installation & Setup Développement

### 9.1 Requirements

- **PHP**: 8.3+
- **Node.js**: 20+
- **PostgreSQL**: 15+ (ou SQLite pour dev)
- **Redis**: 7+ (optionnel pour dev)
- **Docker**: Pour microservice Python (optionnel)

### 9.2 Installation Initiale

```bash
# Cloner le repository
git clone https://github.com/organization/credit-simulator.git
cd credit-simulator

# Installer dépendances Backend
composer install

# Installer dépendances Frontend
npm install

# Copier configuration
cp .env.example .env

# Générer clé Laravel
php artisan key:generate

# Setup base de données
php artisan migrate --seed

# Build assets
npm run build

# Démarrer les queues (dans un terminal séparé)
php artisan queue:work

# Démarrer le serveur Laravel
php artisan serve

# Dans un autre terminal: Démarrer Vite dev server
npm run dev
```

### 9.3 Fichier .env Template

```env
APP_NAME="Credit Simulator"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# ou pour PostgreSQL:
# DB_CONNECTION=pgsql
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=credit_simulator
# DB_USERNAME=postgres
# DB_PASSWORD=password

QUEUE_CONNECTION=sync
# ou en production:
# QUEUE_CONNECTION=redis
# REDIS_HOST=localhost
# REDIS_PASSWORD=null
# REDIS_PORT=6379

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password

# Scoring API
SCORING_API_URL=http://localhost:8001
SCORING_API_KEY=your_api_key_here

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📌 Résumé des Choix Architecturaux

### Séparation des Namespaces

**Principe clé**: Séparation claire entre applicatif et logique métier du domaine.

| Domaine | Namespace | Contenu |
|---------|-----------|---------|
| **Applicatif** | `App\` | Controllers, Routes, Models Eloquent, Middleware, Jobs, Mail, Notifications, Events, HTTP Clients |
| **Métier du Simulateur** | `Core\Simulator\` | Enums, Règles métier, Orchestrateurs tunnel, DTOs, Services scoring, Validateurs, Repositories métier |
| **Tests** | `Tests\` | Tests Feature, Unit, Database |
| **Database** | `Database\` | Migrations, Factories, Seeders |

### Stack Technique Complète

| Couche | Composant | Choix | Justification |
|---|---|---|---|
| **Frontend** | Framework | React 18 | Écosystème mature, composants réutilisables |
| | Liaison | Inertia.js | Intégration seamless avec Laravel, pas d'API REST |
| | État | React Hook Form + Zod | Validation forte, state léger |
| | Styling | styled-components | Contrôle Design System artisanal |
| **Backend** | Framework | Laravel 13 | Artisanal, pas de boîtes noires (Breeze/Fortify) |
| | Auth | Custom | Maîtrise totale du cycle de vie |
| | DB | PostgreSQL | ACID, financièrement critique |
| | Queues | Redis/Database | Asynchronisme pour UX fluide |
| | Email | Mailgun | Production-ready, traçabilité |
| | Enums | Core\Simulator\ | Logique métier centralisée |
| **Microservice** | Framework | FastAPI | Performance, async-first, simple |
| | API Format | REST/JSON | Standard, interopérabilité |
| **Tests** | Backend | Pest | Syntaxe fluide, assertion riches |
| | Frontend | Vitest | Compatible Vite, performance |
| **CI/CD** | Platform | GitHub Actions | Intégration native, gratuit pour open-source |
| **Déploiement** | Container | Docker | Python API containerisée |
| | Hosting | VPS/Railway | Flexibilité, coûts maîtrisés |

---

## 🎯 Principes Directeurs

✅ **Clean Architecture**: Séparation des responsabilités, testabilité  
✅ **Artisanal**: Maîtrise consciente de chaque dépendance  
✅ **Sans sur-ingénierie**: Complexité justifiée par les besoins  
✅ **Type-safe**: TypeScript et PHP strict mode partout  
✅ **Financièrement robuste**: ACID, transactions, logging exhaustif  


