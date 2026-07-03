/**
 * Types du state du tunnel de simulation.
 *
 * Le store ne contient QUE l'état de saisie brut (données `dossier` + tableau
 * `personnes`), l'étape courante et le statut de validation par étape. Le
 * formatage pour l'API (parsing monétaire, mapping du contrat Laravel) se fait
 * au moment de la soumission — jamais ici.
 */

import type {
    BirthCountry,
    Civility,
    EmploymentContract,
    FamilySituation,
    HousingStatus,
    Nationality,
    PersonRole,
    ProfessionalJob,
    ProfessionalSector,
    ProjectType,
} from "../config/enums";
import type { TunnelStepKey } from "../config/steps";

/**
 * Données de la table `dossiers` saisies dans le tunnel.
 * `status` (pipeline CRM) est géré côté serveur, pas dans le tunnel.
 * Les montants sont conservés en `number` (euros), parsés à la soumission.
 */
export interface DossierState {
    // 1. Projet
    project_type: ProjectType | null;
    project_amount: number | null;
    project_duration: number | null;
    // 2. Situation & résidence
    family_situation: FamilySituation | null;
    family_situation_year: string | null;
    has_coborrower: boolean;
    housing_status: HousingStatus | null;
    housing_status_year: string | null;
    // 3. Revenus
    income_net_monthly: number | null;
    income_rental: number | null;
    income_allowance: number | null;
    income_other: number | null;
    // 4. Charges
    charge_housing: number | null;
    charge_mortgage_remaining: number | null;
    housing_property_value: number | null;
    has_active_consumer_credit: boolean;
    charge_consumer_credit_monthly: number | null;
    charge_consumer_credit_remaining: number | null;
    charge_other: number | null;
}

/**
 * Données de la table `personnes` (emprunteur et éventuel co-emprunteur).
 */
export interface PersonneState {
    role: PersonRole;
    // Identité (état civil)
    civility: Civility | null;
    last_name: string | null;
    maiden_name: string | null;
    first_name: string | null;
    /** Format ISO `AAAA-MM-JJ` ou `JJ/MM/AAAA`. */
    birth_date: string | null;
    birth_country: BirthCountry | null;
    nationality: Nationality | null;
    // Situation professionnelle
    professional_sector: ProfessionalSector | null;
    professional_job: ProfessionalJob | null;
    employment_contract: EmploymentContract | null;
    probation_period_ended: boolean | null;
    /** Format `MM/AAAA`. */
    professional_situation_date: string | null;
    // Contact & consentements
    phone: string | null;
    email: string | null;
    consent_data_usage: boolean;
    consent_canvassing: boolean;
    consent_advertising: boolean;
}

/** Statut de validation d'une étape. */
export type StepStatus = "untouched" | "valid" | "invalid";

/** État complet et sérialisable du tunnel (ce qui est persisté en session). */
export interface TunnelState {
    /** Étape courante, 1-based. */
    currentStep: number;
    dossier: DossierState;
    /** `[emprunteur]` ou `[emprunteur, coEmprunteur]`. */
    personnes: PersonneState[];
    stepStatus: Record<TunnelStepKey, StepStatus>;
}

/** Actions exposées par le store (mutations réelles + persistance). */
export interface TunnelStoreActions {
    setField<K extends keyof DossierState>(
        field: K,
        value: DossierState[K],
    ): void;
    setPersonneField<K extends keyof PersonneState>(
        role: PersonRole,
        field: K,
        value: PersonneState[K],
    ): void;
    /** Ajoute (true) ou retire (false) `personnes[1]` (co-emprunteur). */
    toggleCoborrower(enabled: boolean): void;
    setCurrentStep(step: number): void;
    markStep(stepKey: TunnelStepKey, status: StepStatus): void;
    /** Relit la saisie sauvegardée depuis `StorageService('session')`. */
    hydrateFromStorage(): void;
    /** Vide le state ET le storage (après soumission ou "nouvelle simulation"). */
    reset(): void;
}

/** Signature complète du store Zustand. */
export type TunnelStore = TunnelState & TunnelStoreActions;
