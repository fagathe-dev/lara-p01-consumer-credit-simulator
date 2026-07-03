/**
 * Store d'état du tunnel (Zustand).
 *
 * - Contient TOUTES les données saisies : `dossier` + `personnes[]`, l'étape
 *   courante et le statut de validation par étape.
 * - Write-through : à CHAQUE mutation, le state sérialisable est réécrit dans
 *   `StorageService('session')` de `core-ts` (sérialisation JSON + garde-fou
 *   quota/incognito intégrés — on n'appelle jamais `sessionStorage` en direct).
 * - `session` et non `local` : données financières sensibles, pas de rémanence
 *   après fermeture de l'onglet.
 * - Le store ne stocke que la saisie brute ; le formatage API se fait à la
 *   soumission (`format/payload.ts`).
 */

import { create } from "zustand";
import { StorageService } from "core-ts";
import { TUNNEL_STEPS } from "../config/steps";
import type {
    DossierState,
    PersonneState,
    StepStatus,
    TunnelState,
    TunnelStore,
} from "./types";
import type { PersonRole } from "../config/enums";
import type { TunnelStepKey } from "../config/steps";

/** Clé de persistance dédiée au tunnel (isolée du reste du sessionStorage). */
export const TUNNEL_STORAGE_KEY = "tunnel:credit-consommation";

/**
 * Instancie `StorageService('session')` de façon paresseuse et SSR-safe
 * (le constructeur accède à `window`, absent côté serveur Inertia).
 */
function getStorage(): StorageService | null {
    if (typeof window === "undefined") {
        return null;
    }
    return new StorageService("session");
}

function createEmptyDossier(): DossierState {
    return {
        project_type: null,
        project_amount: null,
        project_duration: null,
        family_situation: null,
        family_situation_year: null,
        has_coborrower: false,
        housing_status: null,
        housing_status_year: null,
        income_net_monthly: null,
        income_rental: null,
        income_allowance: null,
        income_other: null,
        charge_housing: null,
        charge_mortgage_remaining: null,
        housing_property_value: null,
        has_active_consumer_credit: false,
        charge_consumer_credit_monthly: null,
        charge_consumer_credit_remaining: null,
        charge_other: null,
    };
}

function createEmptyPersonne(role: PersonRole): PersonneState {
    return {
        role,
        civility: null,
        last_name: null,
        maiden_name: null,
        first_name: null,
        birth_date: null,
        birth_country: null,
        nationality: null,
        professional_sector: null,
        professional_job: null,
        employment_contract: null,
        probation_period_ended: null,
        professional_situation_date: null,
        phone: null,
        email: null,
        consent_data_usage: false,
        consent_canvassing: false,
        consent_advertising: false,
    };
}

function createInitialStepStatus(): Record<TunnelStepKey, StepStatus> {
    return TUNNEL_STEPS.reduce(
        (acc, step) => {
            acc[step.key] = "untouched";
            return acc;
        },
        {} as Record<TunnelStepKey, StepStatus>,
    );
}

function createInitialState(): TunnelState {
    return {
        currentStep: 1,
        dossier: createEmptyDossier(),
        personnes: [createEmptyPersonne("emprunteur")],
        stepStatus: createInitialStepStatus(),
    };
}

/** Garantit la présence d'un co-emprunteur en position 1. */
function ensureCoborrower(personnes: PersonneState[]): PersonneState[] {
    const borrower = personnes[0] ?? createEmptyPersonne("emprunteur");
    const coborrower = personnes[1] ?? createEmptyPersonne("co_emprunteur");
    return [borrower, coborrower];
}

/** Extrait la tranche sérialisable et l'écrit en session (write-through). */
function persist(state: TunnelState): void {
    const storage = getStorage();
    if (!storage) {
        return;
    }
    const snapshot: TunnelState = {
        currentStep: state.currentStep,
        dossier: state.dossier,
        personnes: state.personnes,
        stepStatus: state.stepStatus,
    };
    storage.set(TUNNEL_STORAGE_KEY, snapshot);
}

export const useTunnelStore = create<TunnelStore>((set, get) => ({
    ...createInitialState(),

    setField(field, value) {
        set((state) => {
            const dossier: DossierState = { ...state.dossier, [field]: value };
            let personnes = state.personnes;
            // Co-emprunteur activé par défaut si marié(e) (cf. specs).
            if (
                field === "family_situation" &&
                value === "marie" &&
                !state.dossier.has_coborrower
            ) {
                dossier.has_coborrower = true;
                personnes = ensureCoborrower(state.personnes);
            }
            return { dossier, personnes };
        });
        persist(get());
    },

    setPersonneField(role, field, value) {
        set((state) => ({
            personnes: state.personnes.map((personne) => {
                if (personne.role !== role) {
                    return personne;
                }
                const updated = { ...personne, [field]: value };
                // Cascade pays de naissance → nationalité (cf. specs) :
                // - né en France → nationalité forcée à `france` (champ masqué) ;
                // - né hors de France → champ réaffiché, valeur réinitialisée
                //   pour forcer un choix explicite.
                if (field === "birth_country") {
                    updated.nationality =
                        value === "france" ? "france" : null;
                }
                return updated;
            }),
        }));
        persist(get());
    },

    toggleCoborrower(enabled) {
        set((state) => ({
            dossier: { ...state.dossier, has_coborrower: enabled },
            personnes: enabled
                ? ensureCoborrower(state.personnes)
                : state.personnes.slice(0, 1),
        }));
        persist(get());
    },

    setCurrentStep(step) {
        set({ currentStep: step });
        persist(get());
    },

    markStep(stepKey, status) {
        set((state) => ({
            stepStatus: { ...state.stepStatus, [stepKey]: status },
        }));
        persist(get());
    },

    hydrateFromStorage() {
        const storage = getStorage();
        if (!storage) {
            return;
        }
        const saved = storage.get(TUNNEL_STORAGE_KEY);
        if (!saved || typeof saved !== "object") {
            return;
        }
        const partial = saved as Partial<TunnelState>;
        const personnes =
            Array.isArray(partial.personnes) && partial.personnes.length > 0
                ? partial.personnes
                : [createEmptyPersonne("emprunteur")];
        set({
            currentStep:
                typeof partial.currentStep === "number"
                    ? partial.currentStep
                    : 1,
            dossier: { ...createEmptyDossier(), ...(partial.dossier ?? {}) },
            personnes,
            stepStatus: {
                ...createInitialStepStatus(),
                ...(partial.stepStatus ?? {}),
            },
        });
    },

    reset() {
        const storage = getStorage();
        storage?.remove(TUNNEL_STORAGE_KEY);
        set(createInitialState());
    },
}));
