/**
 * Définition déclarative des SECTIONS et des ÉTAPES du tunnel.
 *
 * Modèle à deux niveaux :
 * - une SECTION regroupe plusieurs étapes (granularité grossière du stepper) ;
 * - une ÉTAPE est l'unité de saisie (granularité fine de la barre de progression).
 *
 * Source unique de vérité : le moteur ne code jamais "en dur" le nombre
 * d'étapes/sections ni leur enchaînement — tout est dérivé de
 * `TUNNEL_SECTIONS` / `TUNNEL_STEPS`.
 */

import type { DossierState, PersonneState, TunnelState } from "../store/types";

/**
 * Portée d'une étape vis-à-vis des personnes :
 * - `none` : étape "dossier" ou étape mixte (emprunteur + co-emprunteur) ;
 * - `borrower` : étape ne concernant que l'emprunteur (`personnes[0]`) ;
 * - `coborrower` : étape ne concernant que le co-emprunteur (`personnes[1]`),
 *   retirée du parcours si `has_coborrower === false`.
 */
export type PersonScope = "none" | "borrower" | "coborrower";

/** Clé stable d'une section (indépendante de sa position). */
export type TunnelSectionKey =
    | "projet"
    | "situation"
    | "pro"
    | "finances"
    | "profil";

/** Clé stable d'une étape (utilisée pour le mapping des champs + la validation). */
export type TunnelStepKey =
    | "projet_type"
    | "projet_montant"
    | "situation_familiale"
    | "situation_logement"
    | "pro_emprunteur"
    | "pro_coemprunteur"
    | "revenus"
    | "charges"
    | "civilite"
    | "nationalite"
    | "contact_emprunteur"
    | "contact_coemprunteur";

/** Métadonnées d'une étape. */
export interface TunnelStepMeta {
    /** Clé stable, indépendante de la position. */
    key: TunnelStepKey;
    /** Section à laquelle appartient l'étape. */
    sectionKey: TunnelSectionKey;
    /** Titre propre de l'étape (affiché dans le header de contenu). */
    label: string;
    /** Portée personne de l'étape. */
    scope: PersonScope;
    /** Ordre 1-based absolu dans le parcours complet (12 étapes). */
    order: number;
}

/** Métadonnées d'une section. */
export interface TunnelSectionMeta {
    key: TunnelSectionKey;
    /** Libellé affiché dans le stepper. */
    label: string;
    /** Clés d'étapes composant la section, dans l'ordre. */
    stepKeys: TunnelStepKey[];
}

/**
 * Sections du tunnel (5 sections / 12 étapes).
 * Le stepper affiche ces marqueurs ; la barre de progression avance au rythme
 * des étapes.
 */
export const TUNNEL_SECTIONS: readonly TunnelSectionMeta[] = [
    {
        key: "projet",
        label: "Votre projet",
        stepKeys: ["projet_type", "projet_montant"],
    },
    {
        key: "situation",
        label: "Votre situation",
        stepKeys: ["situation_familiale", "situation_logement"],
    },
    {
        key: "pro",
        label: "Situation professionnelle",
        stepKeys: ["pro_emprunteur", "pro_coemprunteur"],
    },
    {
        key: "finances",
        label: "Situation financière",
        stepKeys: ["revenus", "charges"],
    },
    {
        key: "profil",
        label: "Votre profil",
        stepKeys: [
            "civilite",
            "nationalite",
            "contact_emprunteur",
            "contact_coemprunteur",
        ],
    },
] as const;

/** Titre propre + portée de chaque étape (par clé), avant aplatissement. */
const STEP_DEFINITIONS: Record<
    TunnelStepKey,
    { label: string; scope: PersonScope }
> = {
    projet_type: { label: "Votre projet", scope: "none" },
    projet_montant: { label: "Montant et durée", scope: "none" },
    situation_familiale: {
        label: "Votre situation familiale",
        scope: "none",
    },
    situation_logement: { label: "Votre logement", scope: "none" },
    pro_emprunteur: {
        label: "Votre situation professionnelle",
        scope: "borrower",
    },
    pro_coemprunteur: {
        label: "Situation professionnelle du co-emprunteur",
        scope: "coborrower",
    },
    revenus: { label: "Vos revenus", scope: "none" },
    charges: { label: "Vos charges", scope: "none" },
    civilite: { label: "Votre identité", scope: "none" },
    nationalite: { label: "Naissance et nationalité", scope: "none" },
    contact_emprunteur: { label: "Vos coordonnées", scope: "borrower" },
    contact_coemprunteur: {
        label: "Coordonnées du co-emprunteur",
        scope: "coborrower",
    },
};

/**
 * Étapes du tunnel, à plat et ordonnées, dérivées de `TUNNEL_SECTIONS`.
 * `order` est l'index 1-based absolu (jamais codé en dur ailleurs).
 */
export const TUNNEL_STEPS: readonly TunnelStepMeta[] = TUNNEL_SECTIONS.flatMap(
    (section) =>
        section.stepKeys.map((stepKey) => ({
            key: stepKey,
            sectionKey: section.key,
            label: STEP_DEFINITIONS[stepKey].label,
            scope: STEP_DEFINITIONS[stepKey].scope,
            order: 0, // réécrit juste après pour un ordre 1-based global stable
        })),
).map((step, index) => ({ ...step, order: index + 1 }));

/**
 * Durées de crédit disponibles, en mois.
 * Aligné sur `db.md` (fait foi).
 */
export const PROJECT_DURATIONS: readonly number[] = [
    6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120,
] as const;

/** Nombre total d'étapes déclarées (jamais codé en dur ailleurs). */
export const TOTAL_STEPS = TUNNEL_STEPS.length;

/**
 * Mapping étape → champs du modèle de données (cf. `db.md`).
 * `dossier` : champs de la table `dossiers`.
 * `personne` : champs de la table `personnes`, appliqués aux personnes ciblées
 * par la portée de l'étape (cf. `personneIndicesForStep`).
 * Consommé par la validation et par le formatage du payload.
 */
export const STEP_FIELDS: Record<
    TunnelStepKey,
    {
        dossier: readonly (keyof DossierState)[];
        personne: readonly (keyof PersonneState)[];
    }
> = {
    projet_type: {
        dossier: ["project_type"],
        personne: [],
    },
    projet_montant: {
        dossier: ["project_amount", "project_duration"],
        personne: [],
    },
    situation_familiale: {
        dossier: [
            "family_situation",
            "family_situation_year",
            "has_coborrower",
        ],
        personne: [],
    },
    situation_logement: {
        dossier: ["housing_status", "housing_status_year"],
        personne: [],
    },
    pro_emprunteur: {
        dossier: [],
        personne: [
            "professional_sector",
            "professional_job",
            "employment_contract",
            "probation_period_ended",
            "professional_situation_date",
        ],
    },
    pro_coemprunteur: {
        dossier: [],
        personne: [
            "professional_sector",
            "professional_job",
            "employment_contract",
            "probation_period_ended",
            "professional_situation_date",
        ],
    },
    revenus: {
        dossier: [
            "income_net_monthly",
            "income_rental",
            "income_allowance",
            "income_other",
        ],
        personne: [],
    },
    charges: {
        dossier: [
            "charge_housing",
            "charge_mortgage_remaining",
            "housing_property_value",
            "has_active_consumer_credit",
            "charge_consumer_credit_monthly",
            "charge_consumer_credit_remaining",
            "charge_other",
        ],
        personne: [],
    },
    civilite: {
        dossier: [],
        personne: ["civility", "last_name", "maiden_name", "first_name"],
    },
    nationalite: {
        dossier: [],
        personne: ["birth_date", "birth_country", "nationality"],
    },
    contact_emprunteur: {
        dossier: [],
        personne: [
            "phone",
            "email",
            "consent_data_usage",
            "consent_canvassing",
            "consent_advertising",
        ],
    },
    contact_coemprunteur: {
        dossier: [],
        personne: [
            "phone",
            "email",
            "consent_data_usage",
            "consent_canvassing",
            "consent_advertising",
        ],
    },
};

const STEP_BY_KEY = new Map<TunnelStepKey, TunnelStepMeta>(
    TUNNEL_STEPS.map((step) => [step.key, step]),
);

const STEP_BY_ORDER = new Map<number, TunnelStepMeta>(
    TUNNEL_STEPS.map((step) => [step.order, step]),
);

const SECTION_BY_KEY = new Map<TunnelSectionKey, TunnelSectionMeta>(
    TUNNEL_SECTIONS.map((section) => [section.key, section]),
);

/** Retourne les métadonnées d'une étape par sa clé. */
export function getStepByKey(key: TunnelStepKey): TunnelStepMeta {
    const step = STEP_BY_KEY.get(key);
    if (!step) {
        throw new Error(`Étape inconnue: ${key}`);
    }
    return step;
}

/** Retourne les métadonnées d'une étape par son ordre 1-based absolu. */
export function getStepByOrder(order: number): TunnelStepMeta | undefined {
    return STEP_BY_ORDER.get(order);
}

/** Convertit un ordre 1-based absolu en clé d'étape. */
export function orderToStepKey(order: number): TunnelStepKey | undefined {
    return STEP_BY_ORDER.get(order)?.key;
}

/** Retourne la section à laquelle appartient une étape. */
export function getSectionOfStep(stepKey: TunnelStepKey): TunnelSectionMeta {
    const step = getStepByKey(stepKey);
    const section = SECTION_BY_KEY.get(step.sectionKey);
    if (!section) {
        throw new Error(`Section inconnue pour l'étape: ${stepKey}`);
    }
    return section;
}

/**
 * Une étape est-elle dans le parcours courant (indépendamment de ses champs) ?
 * Seules les étapes entièrement co-emprunteur (`scope === 'coborrower'`) sont
 * conditionnées par `has_coborrower`.
 */
export function isStepInScope(
    step: TunnelStepMeta,
    state: TunnelState,
): boolean {
    if (step.scope === "coborrower") {
        return state.dossier.has_coborrower === true;
    }
    return true;
}

/**
 * Liste ordonnée des étapes visibles du parcours courant (10 ou 12 selon
 * `has_coborrower`). Les étapes co-emprunteur masquées sont retirées.
 */
export function getVisibleSteps(state: TunnelState): TunnelStepMeta[] {
    return TUNNEL_STEPS.filter((step) => isStepInScope(step, state));
}

/**
 * Indices des personnes concernées par une étape, selon sa portée :
 * - `borrower` → `[0]` ;
 * - `coborrower` → `[1]` si présent ;
 * - `none` : `[0]` seule pour une étape mono-personne, ou `[0, 1]` pour une
 *   étape mixte (civilité / nationalité) quand `has_coborrower === true`.
 */
export function personneIndicesForStep(
    stepKey: TunnelStepKey,
    state: TunnelState,
): number[] {
    const step = getStepByKey(stepKey);
    if (step.scope === "borrower") {
        return [0];
    }
    if (step.scope === "coborrower") {
        return state.dossier.has_coborrower && state.personnes[1] ? [1] : [];
    }
    // scope `none` : mixte si l'étape porte des champs personne.
    if (STEP_FIELDS[stepKey].personne.length === 0) {
        return [];
    }
    return state.dossier.has_coborrower && state.personnes[1] ? [0, 1] : [0];
}
