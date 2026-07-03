/**
 * Validation du tunnel — source de vérité front.
 *
 * Décision projet : Zod n'étant pas installé, la validation est implémentée en
 * validateurs TypeScript purs, exposant le contrat attendu
 * (`validateStep` / `validateAll` / `StepValidationResult`). Elle ne valide que
 * les champs actuellement visibles (cf. `fieldVisibility`) et applique les
 * refinements conditionnels de `specs.md`.
 *
 * Cette validation front est une PREMIÈRE BARRIÈRE UX ; elle ne remplace pas la
 * validation serveur (Form Requests Laravel), qui reste l'autorité finale.
 */

import { DateCalculator, ensureDate, isEmail } from "core-ts";
import {
    BIRTH_COUNTRIES,
    CIVILITIES,
    EMPLOYMENT_CONTRACTS,
    FAMILY_SITUATIONS,
    HOUSING_STATUSES,
    jobsForSector,
    PROFESSIONAL_SECTORS,
    PROJECT_TYPES,
} from "../config/enums";
import {
    isDossierFieldVisible,
    isPersonneFieldVisible,
} from "../config/fieldVisibility";
import {
    STEP_FIELDS,
    TUNNEL_STEPS,
    personneIndicesForStep,
    type TunnelStepKey,
} from "../config/steps";
import { PROJECT_DURATIONS } from "../config/steps";
import type { DossierState, PersonneState, TunnelState } from "../store/types";

/** Résultat de validation d'une étape : erreurs mappées par chemin de champ. */
export interface StepValidationResult {
    valid: boolean;
    /** Ex. `{ 'dossier.project_amount': 'Montant requis', ... }`. */
    errors: Record<string, string>;
}

// --- Helpers de validation (messages en français, prêts pour `FieldError`) ---

const REQUIRED = "Ce champ est requis.";

function isBlank(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    );
}

function requireValue(value: unknown, message = REQUIRED): string | null {
    return isBlank(value) ? message : null;
}

function requirePositive(
    value: number | null,
    { allowZero = false } = {},
): string | null {
    if (value === null || Number.isNaN(value)) {
        return "Veuillez saisir un montant.";
    }
    if (allowZero ? value < 0 : value <= 0) {
        return allowZero
            ? "Le montant ne peut pas être négatif."
            : "Le montant doit être supérieur à 0.";
    }
    return null;
}

function requireOptionalPositive(value: number | null): string | null {
    if (value === null) {
        return null;
    }
    return requirePositive(value, { allowZero: true });
}

const YEAR_RE = /^\d{4}$/;
const MONTH_YEAR_RE = /^(0[1-9]|1[0-2])\/\d{4}$/;
// Téléphone FR : 0X XX XX XX XX ou +33X…, séparateurs espace/point/tiret tolérés.
const FR_PHONE_RE = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;

function requireYear(value: string | null): string | null {
    const missing = requireValue(value);
    if (missing) {
        return missing;
    }
    if (!YEAR_RE.test(value as string)) {
        return "Année invalide (format attendu : AAAA).";
    }
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        return `Année invalide (entre 1900 et ${currentYear}).`;
    }
    return null;
}

/** Parse `AAAA-MM-JJ` (input date natif) ou `JJ/MM/AAAA` (saisie FR). */
function parseBirthDate(value: string): Date | null {
    const fr = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (fr) {
        const [, day, month, year] = fr;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(date.getTime()) ? null : date;
    }
    try {
        return ensureDate(value);
    } catch {
        return null;
    }
}

function computeAge(birth: Date): number {
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age;
}

// --- Validateurs par champ `dossier` (appelés uniquement si visibles) ---

type DossierValidator = (state: TunnelState) => string | null;

const dossierValidators: Partial<Record<keyof DossierState, DossierValidator>> =
    {
        project_type: (s) =>
            requireValue(s.dossier.project_type) ??
            (PROJECT_TYPES.includes(s.dossier.project_type as never)
                ? null
                : "Type de projet invalide."),
        project_amount: (s) => requirePositive(s.dossier.project_amount),
        project_duration: (s) => {
            const missing = requireValue(s.dossier.project_duration);
            if (missing) {
                return missing;
            }
            return PROJECT_DURATIONS.includes(
                s.dossier.project_duration as number,
            )
                ? null
                : "Durée non proposée.";
        },
        family_situation: (s) =>
            requireValue(s.dossier.family_situation) ??
            (FAMILY_SITUATIONS.includes(s.dossier.family_situation as never)
                ? null
                : "Situation familiale invalide."),
        family_situation_year: (s) =>
            requireYear(s.dossier.family_situation_year),
        housing_status: (s) =>
            requireValue(s.dossier.housing_status) ??
            (HOUSING_STATUSES.includes(s.dossier.housing_status as never)
                ? null
                : "Statut de logement invalide."),
        housing_status_year: (s) => requireYear(s.dossier.housing_status_year),
        income_net_monthly: (s) =>
            requirePositive(s.dossier.income_net_monthly),
        income_rental: (s) => requireOptionalPositive(s.dossier.income_rental),
        income_allowance: (s) =>
            requireOptionalPositive(s.dossier.income_allowance),
        income_other: (s) => requireOptionalPositive(s.dossier.income_other),
        charge_housing: (s) =>
            s.dossier.housing_status === "locataire"
                ? requirePositive(s.dossier.charge_housing)
                : requireOptionalPositive(s.dossier.charge_housing),
        charge_mortgage_remaining: (s) =>
            requirePositive(s.dossier.charge_mortgage_remaining, {
                allowZero: true,
            }),
        housing_property_value: (s) =>
            requirePositive(s.dossier.housing_property_value),
        charge_consumer_credit_monthly: (s) =>
            requirePositive(s.dossier.charge_consumer_credit_monthly),
        charge_consumer_credit_remaining: (s) =>
            requirePositive(s.dossier.charge_consumer_credit_remaining),
        charge_other: (s) => requireOptionalPositive(s.dossier.charge_other),
    };

// --- Validateurs par champ `personne` (appelés uniquement si visibles) ---

type PersonneValidator = (
    personne: PersonneState,
    state: TunnelState,
) => string | null;

const personneValidators: Partial<
    Record<keyof PersonneState, PersonneValidator>
> = {
    professional_sector: (p) =>
        requireValue(p.professional_sector) ??
        (PROFESSIONAL_SECTORS.includes(p.professional_sector as never)
            ? null
            : "Secteur invalide."),
    professional_job: (p) => {
        const missing = requireValue(p.professional_job);
        if (missing) {
            return missing;
        }
        if (p.professional_sector == null) {
            return null;
        }
        const allowed = jobsForSector(p.professional_sector);
        return allowed.includes(p.professional_job as never)
            ? null
            : "Profession incompatible avec le secteur.";
    },
    employment_contract: (p) =>
        requireValue(p.employment_contract) ??
        (EMPLOYMENT_CONTRACTS.includes(p.employment_contract as never)
            ? null
            : "Type de contrat invalide."),
    probation_period_ended: (p) =>
        typeof p.probation_period_ended === "boolean"
            ? null
            : "Veuillez préciser si la période d'essai est terminée.",
    professional_situation_date: (p) => {
        const missing = requireValue(p.professional_situation_date);
        if (missing) {
            return missing;
        }
        return MONTH_YEAR_RE.test(p.professional_situation_date as string)
            ? null
            : "Format attendu : MM/AAAA.";
    },
    civility: (p) =>
        requireValue(p.civility) ??
        (CIVILITIES.includes(p.civility as never)
            ? null
            : "Civilité invalide."),
    last_name: (p) => requireValue(p.last_name),
    first_name: (p) => requireValue(p.first_name),
    maiden_name: (p, s) =>
        // Requis uniquement si Mme ET marié(e) (cf. specs) ; sinon optionnel.
        p.civility === "mme" && s.dossier.family_situation === "marie"
            ? requireValue(p.maiden_name)
            : null,
    birth_date: (p) => {
        const missing = requireValue(p.birth_date);
        if (missing) {
            return missing;
        }
        const date = parseBirthDate(p.birth_date as string);
        if (!date) {
            return "Date de naissance invalide.";
        }
        if (!DateCalculator.isPast(date)) {
            return "La date de naissance doit être dans le passé.";
        }
        if (computeAge(date) < 18) {
            return "Vous devez être majeur(e).";
        }
        return null;
    },
    birth_country: (p) =>
        requireValue(p.birth_country) ??
        (BIRTH_COUNTRIES.includes(p.birth_country as never)
            ? null
            : "Pays de naissance invalide."),
    nationality: (p) =>
        // Optionnelle si né en France, requise sinon.
        p.birth_country && p.birth_country !== "france"
            ? requireValue(p.nationality)
            : null,
    phone: (p) => {
        const missing = requireValue(p.phone);
        if (missing) {
            return missing;
        }
        return FR_PHONE_RE.test((p.phone as string).replace(/\s+/g, " ").trim())
            ? null
            : "Numéro de téléphone invalide (format FR).";
    },
    email: (p) => {
        const missing = requireValue(p.email);
        if (missing) {
            return missing;
        }
        return isEmail(p.email as string) ? null : "Adresse e-mail invalide.";
    },
    consent_data_usage: (p) =>
        p.consent_data_usage === true
            ? null
            : "Ce consentement est nécessaire pour étudier votre demande.",
};

/**
 * Valide UNIQUEMENT les champs visibles de l'étape et retourne les erreurs
 * mappées par chemin de champ.
 */
export function validateStep(
    stepKey: TunnelStepKey,
    state: TunnelState,
): StepValidationResult {
    const errors: Record<string, string> = {};
    const fields = STEP_FIELDS[stepKey];

    for (const field of fields.dossier) {
        if (!isDossierFieldVisible(field, state)) {
            continue;
        }
        const validator = dossierValidators[field];
        const error = validator?.(state);
        if (error) {
            errors[`dossier.${field}`] = error;
        }
    }

    // Ne valide que les personnes concernées par la portée de l'étape
    // (emprunteur, co-emprunteur, ou les deux pour les étapes mixtes).
    for (const index of personneIndicesForStep(stepKey, state)) {
        const personne = state.personnes[index];
        if (!personne) {
            continue;
        }
        for (const field of fields.personne) {
            if (!isPersonneFieldVisible(field, personne, state)) {
                continue;
            }
            const validator = personneValidators[field];
            const error = validator?.(personne, state);
            if (error) {
                errors[`personnes.${index}.${field}`] = error;
            }
        }
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/** Un validateur par étape (équivalent des "schémas Zod par étape"). */
export const stepValidators: Record<
    TunnelStepKey,
    (state: TunnelState) => StepValidationResult
> = TUNNEL_STEPS.reduce(
    (acc, step) => {
        acc[step.key] = (state: TunnelState) => validateStep(step.key, state);
        return acc;
    },
    {} as Record<TunnelStepKey, (state: TunnelState) => StepValidationResult>,
);

/** Valide l'ensemble du tunnel avant la soumission finale. */
export function validateAll(state: TunnelState): StepValidationResult {
    const errors: Record<string, string> = {};
    for (const step of TUNNEL_STEPS) {
        const result = validateStep(step.key, state);
        Object.assign(errors, result.errors);
    }
    return { valid: Object.keys(errors).length === 0, errors };
}
