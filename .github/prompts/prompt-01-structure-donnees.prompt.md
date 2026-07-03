# Prompt — Génération de la Structure de Données (Migrations, Enums, Modèles)

## Contexte

Tu travailles sur un clone de simulateur de crédit B2C (type Sofinco) avec CRM d'administration.
Stack backend : **Laravel 13**, PHP 8.3+, base **PostgreSQL** (SQLite en dev), Eloquent ORM.

L'architecture de données repose sur une relation **1-to-N** :
```
dossiers (1) ──→ (N) personnes
```
Un `dossier` centralise la demande de crédit (projet, situation, finances du foyer).
Une `personne` représente l'emprunteur ou le co-emprunteur (identité, profession, contact, consentements).

## Objectif

Générer, dans un projet Laravel 13 existant, **l'ensemble de la couche de structure de données** :

1. Les **migrations** des tables `dossiers` et `personnes`
2. Les **Enums PHP natifs (Backed Enums, PHP 8.1+)** utilisés par ces tables
3. Les **Modèles Eloquent** `Dossier` et `Personne` avec relations, casts d'enums, et `$fillable`/`$casts` cohérents

Ne pas générer les Form Requests, contrôleurs, seeders ou factories à ce stade — uniquement la structure de données.

---

## 1. Migration `dossiers`

Créer la migration `create_dossiers_table` avec les colonnes suivantes (respecter strictement types, nullabilité et valeurs par défaut) :

### Projet
- `project_type` : string (enum `ProjectTypeEnum`), NOT NULL
- `project_amount` : `decimal(10, 2)`, NOT NULL, contrainte applicative > 0
- `project_duration` : `integer`, NOT NULL (valeurs attendues : 6,12,24,36,48,60,72,84,96,108,120 — à valider au niveau applicatif, pas en contrainte SQL)
- `status` : string (enum `ApplicationStatusEnum`), NOT NULL, défaut `new`

### Situation & Résidence
- `family_situation` : string (enum `FamilySituationEnum`), NOT NULL
- `family_situation_year` : string(4), nullable
- `has_coborrower` : boolean, NOT NULL, défaut `false`
- `housing_status` : string (enum `HousingStatusEnum`), NOT NULL
- `housing_status_year` : string(4), nullable

### Finances — Revenus
- `income_net_monthly` : `decimal(10, 2)`, NOT NULL
- `income_rental` : `decimal(10, 2)`, nullable
- `income_allowance` : `decimal(10, 2)`, nullable
- `income_other` : `decimal(10, 2)`, nullable

### Finances — Charges
- `charge_housing` : `decimal(10, 2)`, nullable
- `charge_mortgage_remaining` : `decimal(10, 2)`, nullable
- `housing_property_value` : `decimal(10, 2)`, nullable
- `has_active_consumer_credit` : boolean, NOT NULL, défaut `false`
- `charge_consumer_credit_monthly` : `decimal(10, 2)`, nullable
- `charge_consumer_credit_remaining` : `decimal(10, 2)`, nullable
- `charge_other` : `decimal(10, 2)`, nullable

### Timestamps
- `timestamps()` standard Laravel (`created_at`, `updated_at`)

> ⚠️ Les règles "obligatoire si propriétaire", "obligatoire si crédit actif", etc. sont des règles de **validation applicative** (Form Request), pas des contraintes de colonnes SQL. Toutes ces colonnes doivent donc rester `nullable()` au niveau migration, sauf les champs explicitement listés NOT NULL ci-dessus.

---

## 2. Migration `personnes`

Créer la migration `create_personnes_table` avec :

### Relation
- `dossier_id` : `foreignId` vers `dossiers`, `onDelete('cascade')`
- `role` : string (enum `PersonRoleEnum`), NOT NULL

### Identité
- `civility` : string (enum `CivilityEnum`), NOT NULL
- `last_name` : string, NOT NULL
- `maiden_name` : string, nullable
- `first_name` : string, NOT NULL
- `birth_date` : date, NOT NULL
- `birth_country` : string (enum `BirthCountryEnum`), nullable
- `nationality` : string (enum `NationalityEnum`), nullable

### Situation Professionnelle
- `professional_sector` : integer (enum `ProfessionalSectorEnum`), NOT NULL
- `professional_job` : integer (enum `ProfessionalJobEnum`), NOT NULL
- `employment_contract` : string (enum `EmploymentContractEnum`), nullable
- `probation_period_ended` : boolean, nullable
- `professional_situation_date` : string(7), NOT NULL (format `MM/AAAA`)

### Contact & Consentements
- `phone` : string, NOT NULL
- `email` : string, NOT NULL
- `consent_data_usage` : boolean, NOT NULL, défaut `false`
- `consent_canvassing` : boolean, NOT NULL, défaut `false`
- `consent_advertising` : boolean, NOT NULL, défaut `false`

### Timestamps
- `timestamps()` standard Laravel

---

## 3. Enums (Backed Enums PHP 8.1+)

Namespace : `Core\Simulator\Enum` (adapter le chemin réel selon la config PSR-4 du projet, ex. `app/Core/Simulator/Enum/` — vérifier `composer.json` avant de créer les fichiers).

Chaque enum doit implémenter au minimum :
- `label(): string` — libellé français pour l'affichage
- `choices(): array` (static) — `['Libellé' => 'value', ...]` pour les formulaires
- `values(): array` (static) — liste brute des valeurs

Enums à créer :

| Enum | Type backing | Cases |
|---|---|---|
| `ProjectTypeEnum` | string | `AUTO_MOTO`, `REGROUPEMENT_CREDITS`, `TRAVAUX`, `AUTRE`, `FAMILLE_LOISIR` |
| `ApplicationStatusEnum` | string | `NEW`, `IN_PROGRESS`, `ACCEPTE`, `REFUSED` — ajouter aussi une méthode `color(): string` (couleur Kanban) |
| `FamilySituationEnum` | string | `CELIBATAIRE`, `MARIE`, `PACS`, `DIVORCE_VEUF` |
| `HousingStatusEnum` | string | `FONCTION`, `PROPRIETAIRE`, `HEBERGE`, `LOCATAIRE` |
| `PersonRoleEnum` | string | `BORROWER` (`emprunteur`), `COBORROWER` (`co_emprunteur`) |
| `CivilityEnum` | string | `M`, `MME`, `AUTRE` |
| `BirthCountryEnum` | string | `FRANCE`, `UE`, `HORS_UE` |
| `NationalityEnum` | string | `FRANCE`, `UE`, `HORS_UE` |
| `EmploymentContractEnum` | string | `CDI`, `STAGE`, `INTERIM`, `CDD`, `AUTRE` |
| `ProfessionalSectorEnum` | int | `PRIVE=10`, `PUBLIC=20`, `AGRICOLE=30`, `INDEPENDANT=40`, `RETRAITE=50`, `ETUDIANT=60`, `CHOMEUR=70`, `INACTIF=80` — ajouter `professions(): array` retournant les cases `ProfessionalJobEnum` de ce secteur |
| `ProfessionalJobEnum` | int | Code composite = `secteur*100 + code_profession` (ex. `1001` = Privé/Cadre supérieur). Reprendre l'intégralité de la liste des professions par secteur fournie dans la documentation `db.md`. Ajouter `sector(): ProfessionalSectorEnum` retournant le secteur parent. |

> Respecter fidèlement les libellés français fournis dans la documentation (`db.md`) pour chaque `label()`.

---

## 4. Modèles Eloquent

### `App\Models\Dossier`
- `$casts` : chaque colonne enum castée vers son Enum PHP (`'project_type' => ProjectTypeEnum::class`, etc.), champs decimal castés `decimal:2`, booléens castés `boolean`
- Relation `personnes(): HasMany` vers `Personne`
- Relation pratique `emprunteur(): HasOne` (where role = BORROWER) et `coEmprunteur(): HasOne` (where role = COBORROWER)

### `App\Models\Personne`
- `$casts` : idem, colonnes enum castées, `birth_date` castée `date`
- Relation `dossier(): BelongsTo` vers `Dossier`

---

## Contraintes de sortie

- Code PHP strict typed (`declare(strict_types=1);`) partout où c'est pertinent
- Respecter les conventions Laravel (nom de fichiers migrations horodatés, `up()`/`down()`)
- Ne pas inventer de champs ou de valeurs d'enum absents de la documentation
- Si un point de la documentation est ambigu, signaler l'ambiguïté plutôt que de deviner
- Livrer un récapitulatif final listant tous les fichiers créés (migrations, enums, modèles)
