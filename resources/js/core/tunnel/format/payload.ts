/**
 * Formatage du payload de soumission.
 *
 * `buildDossierPayload(state)` transforme l'état du tunnel en objet conforme au
 * contrat attendu par le CONTRÔLEUR LARAVEL (`dossier` + `personnes[]`).
 *
 * - Applique `parseMoney` sur tous les champs monétaires (nombres stricts).
 * - N'envoie PAS les champs masqués/non pertinents (cohérent avec les règles de
 *   visibilité) : ex. pas de `charge_mortgage_remaining` si non propriétaire.
 * - Mappe les rôles sur les valeurs exactes de `PersonRoleEnum`.
 * - Ce payload cible LARAVEL UNIQUEMENT — aucune structure liée à l'API Python.
 */

import {
    isDossierFieldVisible,
    isPersonneFieldVisible,
} from "../config/fieldVisibility";
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
import type { DossierState, PersonneState, TunnelState } from "../store/types";
import { parseMoney } from "./money";

/** Contrat `dossier` attendu par Laravel. */
export interface DossierPayload {
    project_type: ProjectType;
    project_amount: number;
    project_duration: number;
    family_situation: FamilySituation;
    family_situation_year?: string;
    has_coborrower: boolean;
    housing_status: HousingStatus;
    housing_status_year?: string;
    income_net_monthly: number;
    income_rental?: number;
    income_allowance?: number;
    income_other?: number;
    charge_housing?: number;
    charge_mortgage_remaining?: number;
    housing_property_value?: number;
    has_active_consumer_credit: boolean;
    charge_consumer_credit_monthly?: number;
    charge_consumer_credit_remaining?: number;
    charge_other?: number;
}

/** Contrat `personne` attendu par Laravel. */
export interface PersonnePayload {
    role: PersonRole;
    civility: Civility;
    last_name: string;
    maiden_name?: string;
    first_name: string;
    birth_date: string;
    birth_country: BirthCountry;
    nationality?: Nationality;
    professional_sector: ProfessionalSector;
    professional_job: ProfessionalJob;
    employment_contract?: EmploymentContract;
    probation_period_ended?: boolean;
    professional_situation_date: string;
    phone: string;
    email: string;
    consent_data_usage: boolean;
    consent_canvassing: boolean;
    consent_advertising: boolean;
}

/** Payload complet posté vers Laravel. */
export interface DossierSubmissionPayload {
    dossier: DossierPayload;
    personnes: PersonnePayload[];
}

/** Ajoute une clé uniquement si la valeur est définie (non `null`/`undefined`). */
function assignDefined<T extends object, K extends keyof T>(
    target: T,
    key: K,
    value: T[K] | null | undefined,
): void {
    if (value !== null && value !== undefined) {
        target[key] = value;
    }
}

function buildDossier(state: TunnelState): DossierPayload {
    const { dossier } = state;

    const payload: DossierPayload = {
        project_type: dossier.project_type as ProjectType,
        project_amount: parseMoney(dossier.project_amount),
        project_duration: dossier.project_duration as number,
        family_situation: dossier.family_situation as FamilySituation,
        has_coborrower: dossier.has_coborrower,
        housing_status: dossier.housing_status as HousingStatus,
        income_net_monthly: parseMoney(dossier.income_net_monthly),
        has_active_consumer_credit: dossier.has_active_consumer_credit,
    };

    if (isDossierFieldVisible("family_situation_year", state)) {
        assignDefined(
            payload,
            "family_situation_year",
            dossier.family_situation_year,
        );
    }
    if (isDossierFieldVisible("housing_status_year", state)) {
        assignDefined(
            payload,
            "housing_status_year",
            dossier.housing_status_year,
        );
    }

    assignDefined(
        payload,
        "income_rental",
        numberOrUndefined(dossier.income_rental),
    );
    assignDefined(
        payload,
        "income_allowance",
        numberOrUndefined(dossier.income_allowance),
    );
    assignDefined(
        payload,
        "income_other",
        numberOrUndefined(dossier.income_other),
    );
    assignDefined(
        payload,
        "charge_housing",
        numberOrUndefined(dossier.charge_housing),
    );
    assignDefined(
        payload,
        "charge_other",
        numberOrUndefined(dossier.charge_other),
    );

    if (isDossierFieldVisible("charge_mortgage_remaining", state)) {
        assignDefined(
            payload,
            "charge_mortgage_remaining",
            numberOrUndefined(dossier.charge_mortgage_remaining),
        );
    }
    if (isDossierFieldVisible("housing_property_value", state)) {
        assignDefined(
            payload,
            "housing_property_value",
            numberOrUndefined(dossier.housing_property_value),
        );
    }
    if (isDossierFieldVisible("charge_consumer_credit_monthly", state)) {
        assignDefined(
            payload,
            "charge_consumer_credit_monthly",
            numberOrUndefined(dossier.charge_consumer_credit_monthly),
        );
    }
    if (isDossierFieldVisible("charge_consumer_credit_remaining", state)) {
        assignDefined(
            payload,
            "charge_consumer_credit_remaining",
            numberOrUndefined(dossier.charge_consumer_credit_remaining),
        );
    }

    return payload;
}

function buildPersonne(
    personne: PersonneState,
    state: TunnelState,
): PersonnePayload {
    const payload: PersonnePayload = {
        role: personne.role,
        civility: personne.civility as Civility,
        last_name: personne.last_name as string,
        first_name: personne.first_name as string,
        birth_date: personne.birth_date as string,
        birth_country: personne.birth_country as BirthCountry,
        professional_sector: personne.professional_sector as ProfessionalSector,
        professional_job: personne.professional_job as ProfessionalJob,
        professional_situation_date:
            personne.professional_situation_date as string,
        phone: personne.phone as string,
        email: personne.email as string,
        consent_data_usage: personne.consent_data_usage,
        consent_canvassing: personne.consent_canvassing,
        consent_advertising: personne.consent_advertising,
    };

    if (isPersonneFieldVisible("maiden_name", personne, state)) {
        assignDefined(payload, "maiden_name", personne.maiden_name);
    }
    // Filet de sécurité : une personne née en France ne doit jamais partir
    // sans nationalité, même si la règle de saisie a été contournée.
    const nationality =
        personne.birth_country === "france" &&
        (personne.nationality === null || personne.nationality === undefined)
            ? "france"
            : personne.nationality;
    assignDefined(payload, "nationality", nationality);
    if (isPersonneFieldVisible("employment_contract", personne, state)) {
        assignDefined(
            payload,
            "employment_contract",
            personne.employment_contract,
        );
    }
    if (isPersonneFieldVisible("probation_period_ended", personne, state)) {
        assignDefined(
            payload,
            "probation_period_ended",
            personne.probation_period_ended,
        );
    }

    return payload;
}

function numberOrUndefined(value: number | null): number | undefined {
    return value === null ? undefined : parseMoney(value);
}

/** Construit le payload complet `{ dossier, personnes }` pour Laravel. */
export function buildDossierPayload(
    state: TunnelState,
): DossierSubmissionPayload {
    const personnes = state.dossier.has_coborrower
        ? state.personnes
        : state.personnes.filter((p) => p.role === "emprunteur");

    return {
        dossier: buildDossier(state),
        personnes: personnes.map((personne) => buildPersonne(personne, state)),
    };
}
