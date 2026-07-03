# Structure de la Base de Données

## Architecture Générale

L'architecture est pensée autour d'une relation **1-to-N (Un à Plusieurs)**. Un dossier possède une ou deux personnes, identifiées par leur rôle (emprunteur ou co-emprunteur).

### Relations entre tables
```
dossiers (1) ──→ (N) personnes
```

---

## Table dossiers

### Présentation
Cette table centralise la demande de crédit, la situation du foyer et les finances globales.

### Sections

#### 1. Projet

- **project_type** : `enum ProjectTypeEnum`
  - Valeurs : `auto_moto`, `regroupement_credits`, `travaux`, `autre`, `famille_loisir`
- **project_amount** : `decimal(10, 2)` — Montant > 0
- **project_duration** : `integer` — Durée en mois
  - Valeurs possibles : 6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120
- **status** : `enum ApplicationStatusEnum` — Suivi du pipeline CRM
  - Valeurs : `new`, `in_progress`, `accepte`, `financed`, `refused`

#### 2. Situation & Résidence

- **family_situation** : `enum FamilySituationEnum`
  - Valeurs : `celibataire`, `marie`, `pacs`, `divorce_veuf`
- **family_situation_year** : `string(4)` (nullable) — Année au format AAAA
- **has_coborrower** : `boolean` — Par défaut : `false`
- **housing_status** : `enum HousingStatusEnum`
  - Valeurs : `fonction`, `proprietaire`, `heberge`, `locataire`
- **housing_status_year** : `string(4)` (nullable) — Année au format AAAA

#### 3. Situation Financière - Revenus

- **income_net_monthly** : `decimal(10, 2)` — Revenu principal net
- **income_rental** : `decimal(10, 2)` (nullable) — Revenus locatifs
- **income_allowance** : `decimal(10, 2)` (nullable) — Allocations
- **income_other** : `decimal(10, 2)` (nullable) — Autres revenus

#### 4. Situation Financière - Charges

- **charge_housing** : `decimal(10, 2)` (nullable) — Loyer ou mensualité de prêt immobilier
- **charge_mortgage_remaining** : `decimal(10, 2)` (nullable) — Obligatoire si propriétaire
- **housing_property_value** : `decimal(10, 2)` (nullable) — Obligatoire si propriétaire
- **has_active_consumer_credit** : `boolean` — Par défaut : `false`
- **charge_consumer_credit_monthly** : `decimal(10, 2)` (nullable) — Obligatoire si crédit actif
- **charge_consumer_credit_remaining** : `decimal(10, 2)` (nullable) — Capital restant
- **charge_other** : `decimal(10, 2)` (nullable) — Autres charges

#### 5. Gestion des Dates

- **created_at** : `datetime`
- **updated_at** : `datetime`

---

## Table personnes

### Présentation
Cette table stocke les informations personnelles, professionnelles et de contact. Elle est liée à un dossier via une clé étrangère.

### Sections

#### 1. Relation avec la table dossiers

- **dossier_id** : `foreignKey` — Clé étrangère vers la table dossiers
- **role** : `enum PersonRoleEnum`
  - Valeurs : `emprunteur`, `co_emprunteur`

#### 2. Identité (État civil)

- **civility** : `enum CivilityEnum`
  - Valeurs : `m`, `mme`, `autre`
- **last_name** : `string` — Nom de famille
- **maiden_name** : `string` (nullable) — Nom de naissance
- **first_name** : `string` — Prénom
- **birth_date** : `date`
- **birthCountry** :`enum BirthCountryEnum` (nullable)
  - Valeurs : `france`, `ue`, `hors_ue`
- **nationality** : `enum NationalityEnum` (nullable)
  - Valeurs : `france`, `ue`, `hors_ue`

#### 3. Situation Professionnelle

- **professional_sector** : `enum ProfessionalSectorEnum` — Code secteur (2 chiffres)
  - Valeurs : `10` (Privé), `20` (Public), `30` (Agricole), `40` (Indépendant), `50` (Retraité), `60` (Étudiant), `70` (Chômeur), `80` (Inactif)
- **professional_job** : `enum ProfessionalJobEnum` — Code profession (2 chiffres)
  - Valeurs : `01` à `16` selon le secteur (voir énumérations ci-dessous)
- **employment_contract** : `enum EmploymentContractEnum` (nullable)
  - Valeurs : `cdi`, `stage`, `interim`, `cdd`, `autre`
- **probation_period_ended** : `boolean` (nullable) — Obligatoire si CDI
- **professional_situation_date** : `string(7)` — Format MM/AAAA

#### 4. Informations de Contact & Consentements

- **phone** : `string`
- **email** : `string`
- **consent_data_usage** : `boolean` — Par défaut : `false`
- **consent_canvassing** : `boolean` — Par défaut : `false`
- **consent_advertising** : `boolean` — Par défaut : `false`

#### 5. Gestion des Dates

- **created_at** : `datetime`
- **updated_at** : `datetime`

---

#### 5. Gestion des Dates

- **created_at** : `datetime`
- **updated_at** : `datetime`

---

## Énumérations

Toutes les énumérations sont implémentées en PHP 8.1+ `Backed Enums` dans le namespace `Core\Simulator\Enum\`.

### ProjectTypeEnum

```php
namespace Core\Simulator\Enum;

enum ProjectTypeEnum: string
{
    case AUTO_MOTO = 'auto_moto';
    case REGROUPEMENT_CREDITS = 'regroupement_credits';
    case TRAVAUX = 'travaux';
    case AUTRE = 'autre';
    case FAMILLE_LOISIR = 'famille_loisir';

    public function label(): string { /* ... */ }
    public static function choices(): array { /* ... */ }
}
```

**Valeurs**: Auto/Moto, Regroupement de crédits, Travaux, Autre, Famille/Loisir

---

### ApplicationStatusEnum

```php
enum ApplicationStatusEnum: string
{
    case NEW = 'new';
    case IN_PROGRESS = 'in_progress';
    case ACCEPTE = 'accepte';
    case REFUSED = 'refused';

    public function label(): string { /* ... */ }
    public function color(): string { /* Retourne couleur Kanban */ }
}
```

**Valeurs**: Nouveau, En cours, Accepté, Refusé

---

### FamilySituationEnum

```php
enum FamilySituationEnum: string
{
    case CELIBATAIRE = 'celibataire';
    case MARIE = 'marie';
    case PACS = 'pacs';
    case DIVORCE_VEUF = 'divorce_veuf';

    public function label(): string { /* ... */ }
    public static function choices(): array { /* Pour formulaires */ }
}
```

**Valeurs**: Célibataire, Marié(e), PACS, Divorcé(e) / Veuf(ve)

---

### HousingStatusEnum

```php
enum HousingStatusEnum: string
{
    case FONCTION = 'fonction';
    case PROPRIETAIRE = 'proprietaire';
    case HEBERGE = 'heberge';
    case LOCATAIRE = 'locataire';

    public function label(): string { /* ... */ }
    public static function choices(): array { /* ... */ }
}
```

**Valeurs**: Logement de fonction, Propriétaire, Hébergé, Locataire

---

### PersonRoleEnum

```php
enum PersonRoleEnum: string
{
    case BORROWER = 'emprunteur';
    case COBORROWER = 'co_emprunteur';

    public function label(): string { /* ... */ }
}
```

**Valeurs**: Emprunteur, Co-emprunteur

---

### CivilityEnum

```php
enum CivilityEnum: string
{
    case M = 'm';
    case MME = 'mme';
    case AUTRE = 'autre';

    public function label(): string { /* ... */ }
}
```

**Valeurs**: M., Mme, Autre

---

### BirthCountryEnum & NationalityEnum

```php
enum BirthCountryEnum: string
{
    case FRANCE = 'france';
    case UE = 'ue';
    case HORS_UE = 'hors_ue';

    public function label(): string { /* "France", "Union Européenne", "Hors UE" */ }
}
```

**Valeurs**: France, Union Européenne, Hors UE

---

### ProfessionalSectorEnum

```php
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

    public function label(): string { /* ... */ }
    public function professions(): array { /* Retourne enum ProfessionalJobEnum pour ce secteur */ }
}
```

**Codes**: 10 (Privé), 20 (Public), 30 (Agricole), 40 (Indépendant/Libéral), 50 (Retraité), 60 (Étudiant), 70 (Chômeur), 80 (Inactif)

---

### ProfessionalJobEnum

```php
enum ProfessionalJobEnum: int
{
    // Privé (10.xx)
    case CADRE_SUPERIEUR = 1001;
    case INGENIEUR = 1002;
    case CADRE_MOYEN = 1003;
    // ... etc

    // Public (20.xx)
    case CADRE_SUP_PUBLIC = 2001;
    case OUVRIER_ETAT = 2003;
    // ... etc

    public function label(): string { /* ... */ }
    public function sector(): ProfessionalSectorEnum { /* Retourne secteur parent */ }
}
```

**Format**: Code composite (Secteur × 100 + Code profession)
- **Privé (10)**: Cadre supérieur (01), Ingénieur (02), Cadre moyen (03), Technicien (04), Contremaître (05), Agent de sécurité (06), etc.
- **Public (20)**: Cadre supérieur (01), Cadre moyen (02), Ouvrier d'État (03), Militaire/Pompier (04), Aide soignant (05)
- **Agricole (30)**: Propriétaire agricole (01), Salarié agricole (02)
- **Indépendant (40)**: Chef d'entreprise (01), Artisan (02), Commerçant (03), VRP (04), Profession libérale (05-06)
- **Retraité (50)**: Retraité secteur privé (01), Retraité secteur public (02)
- **Étudiant (60)**: Étudiant (01)
- **Chômeur (70)**: Demandeur d'emploi (01)
- **Inactif (80)**: Sans profession (01), Invalide/Pensionné (02)

---

## Pattern Commun des Enums

Chaque enum implémente les méthodes suivantes :

```php
enum MyEnum: string|int
{
    case CASE_ONE = 'value1';
    case CASE_TWO = 'value2';

    /**
     * Libellé français pour l'affichage
     */
    public function label(): string
    {
        return match($this) {
            self::CASE_ONE => 'Libellé Cas 1',
            self::CASE_TWO => 'Libellé Cas 2',
        };
    }

    /**
     * Attribut contextuel (optionnel)
     * Ex: couleur Kanban, icône, catégorie, etc.
     */
    public function attribute(): string
    {
        return match($this) {
            self::CASE_ONE => 'value_a',
            self::CASE_TWO => 'value_b',
        };
    }

    /**
     * Retourne toutes les valeurs : ['Libellé 1' => 'value1', 'Libellé 2' => 'value2']
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
     * Retourne toutes les valeurs brutes : ['value1', 'value2']
     */
    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
```
- `02` → Invalide et pensionné

### EmploymentContractEnum
CDI, Stage, Intérim, CDD, Autre

---

## Notes Importantes

- Les champs marqués **(nullable)** sont optionnels
- Les champs marqués **Obligatoire si** dépendent d'autres conditions
- Tous les montants sont en `decimal(10, 2)` pour la précision financière
- Les dates doivent être au format ISO 8601