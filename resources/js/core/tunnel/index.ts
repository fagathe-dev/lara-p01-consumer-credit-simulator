/**
 * API publique du moteur de tunnel.
 *
 * Les composants de `Pages/Simulation/*` et `ui/components/Forms/*` n'importent
 * QUE depuis `@/core/tunnel` — jamais un fichier interne.
 */

// --- Configuration déclarative ---
export {
    TUNNEL_SECTIONS,
    TUNNEL_STEPS,
    PROJECT_DURATIONS,
    TOTAL_STEPS,
    STEP_FIELDS,
    getStepByKey,
    getStepByOrder,
    orderToStepKey,
    getSectionOfStep,
    getVisibleSteps,
    isStepInScope,
    personneIndicesForStep,
    type PersonScope,
    type TunnelSectionKey,
    type TunnelSectionMeta,
    type TunnelStepMeta,
    type TunnelStepKey,
} from "./config/steps";

// --- Enums miroir des Backed Enums PHP ---
export {
    PROJECT_TYPES,
    FAMILY_SITUATIONS,
    HOUSING_STATUSES,
    PERSON_ROLES,
    CIVILITIES,
    BIRTH_COUNTRIES,
    EMPLOYMENT_CONTRACTS,
    PROFESSIONAL_SECTORS,
    PROFESSIONAL_JOBS,
    sectorOfJob,
    jobsForSector,
    sectorHasEmploymentContract,
    type ProjectType,
    type FamilySituation,
    type HousingStatus,
    type PersonRole,
    type Civility,
    type BirthCountry,
    type Nationality,
    type EmploymentContract,
    type ProfessionalSector,
    type ProfessionalJob,
} from "./config/enums";

// --- Règles d'affichage conditionnel ---
export {
    isDossierFieldVisible,
    isPersonneFieldVisible,
    isCoborrowerVisible,
    isStepVisible,
} from "./config/fieldVisibility";

// --- Validation ---
export {
    validateStep,
    validateAll,
    stepValidators,
    type StepValidationResult,
} from "./schema";

// --- Store ---
export { useTunnelStore, TUNNEL_STORAGE_KEY } from "./store/useTunnelStore";
export type {
    DossierState,
    PersonneState,
    TunnelState,
    StepStatus,
    TunnelStoreActions,
    TunnelStore,
} from "./store/types";

// --- Navigation ---
export {
    useTunnelNavigation,
    type UseTunnelNavigationResult,
    type NavigationSection,
    type SectionStatus,
} from "./navigation/useTunnelNavigation";

// --- Formatage ---
export { parseMoney, formatMoney } from "./format/money";
export {
    buildDossierPayload,
    type DossierPayload,
    type PersonnePayload,
    type DossierSubmissionPayload,
} from "./format/payload";

// --- Soumission ---
export {
    useTunnelSubmission,
    type SubmissionStatus,
    type UseTunnelSubmissionResult,
} from "./submission/useTunnelSubmission";

// --- Façade (contrat historique préservé) ---
export { useTunnel, type UseTunnelResult } from "./useTunnel";
