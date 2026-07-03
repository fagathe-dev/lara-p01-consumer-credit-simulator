/**
 * Règles d'affichage conditionnel (progressive disclosure) — prédicats purs.
 *
 * Chaque règle est une fonction pure `(state[, personne]) => boolean`, réutilisée
 * à la fois par l'UI (afficher/masquer un champ) et par la validation (un champ
 * masqué n'est jamais requis). Aucune règle `if` ne doit vivre dans le JSX.
 */

import { sectorHasEmploymentContract } from "./enums";
import type { DossierState, PersonneState, TunnelState } from "../store/types";
import { getStepByKey, isStepInScope, type TunnelStepKey } from "./steps";

/** Situations familiales imposant une année de situation. */
const FAMILY_SITUATIONS_WITH_YEAR: ReadonlySet<string> = new Set([
    "marie",
    "pacs",
    "divorce_veuf",
]);

/** Statuts de logement imposant une année d'emménagement. */
const HOUSING_STATUSES_WITH_YEAR: ReadonlySet<string> = new Set([
    "proprietaire",
    "locataire",
]);

/**
 * Visibilité d'un champ de la table `dossiers`.
 * Les champs non listés sont toujours visibles.
 */
export function isDossierFieldVisible(
    field: keyof DossierState,
    state: TunnelState,
): boolean {
    const { dossier } = state;

    switch (field) {
        case "family_situation_year":
            return (
                dossier.family_situation != null &&
                FAMILY_SITUATIONS_WITH_YEAR.has(dossier.family_situation)
            );
        case "housing_status_year":
            return (
                dossier.housing_status != null &&
                HOUSING_STATUSES_WITH_YEAR.has(dossier.housing_status)
            );
        case "charge_mortgage_remaining":
        case "housing_property_value":
            return dossier.housing_status === "proprietaire";
        case "charge_consumer_credit_monthly":
        case "charge_consumer_credit_remaining":
            return dossier.has_active_consumer_credit === true;
        default:
            return true;
    }
}

/**
 * Visibilité d'un champ de la table `personnes` pour une personne donnée.
 * Les champs non listés sont toujours visibles.
 */
export function isPersonneFieldVisible(
    field: keyof PersonneState,
    personne: PersonneState,
    _state: TunnelState,
): boolean {
    switch (field) {
        case "professional_job":
            // Dépend du secteur sélectionné (liste filtrée dynamiquement).
            return personne.professional_sector != null;
        case "employment_contract":
            // Non pertinent pour retraité / étudiant / chômeur / inactif.
            return (
                personne.professional_sector != null &&
                sectorHasEmploymentContract(personne.professional_sector)
            );
        case "probation_period_ended":
            // Uniquement si CDI.
            return personne.employment_contract === "cdi";
        case "maiden_name":
            // Nom de naissance : uniquement si civilité = Mme.
            return personne.civility === "mme";
        case "nationality":
            // Masquée par défaut ; visible uniquement si né hors de France.
            // Née en France → champ masqué (nationalité forcée à `france`).
            return (
                personne.birth_country != null &&
                personne.birth_country !== "france"
            );
        default:
            return true;
    }
}

/**
 * Le bloc co-emprunteur (`personnes[1]`) est-il pertinent ?
 * Activé dès que `has_coborrower === true`.
 */
export function isCoborrowerVisible(state: TunnelState): boolean {
    return state.dossier.has_coborrower === true;
}

/**
 * Une étape est-elle présente dans le parcours courant ?
 *
 * La visibilité d'étape est désormais pilotée par la PORTÉE de l'étape (scope) :
 * les étapes entièrement co-emprunteur (`pro_coemprunteur`,
 * `contact_coemprunteur`) ne sont visibles que si `has_coborrower === true` ;
 * toutes les autres sont toujours visibles. Le masquage éventuel de certains
 * champs à l'intérieur d'une étape relève, lui, de `isDossierFieldVisible` /
 * `isPersonneFieldVisible`.
 */
export function isStepVisible(
    stepKey: TunnelStepKey,
    state: TunnelState,
): boolean {
    return isStepInScope(getStepByKey(stepKey), state);
}
