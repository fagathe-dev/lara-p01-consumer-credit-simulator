/**
 * Hooks partagés par les composants d'étape.
 *
 * Les étapes ne réimplémentent NI la validation NI la visibilité : elles
 * consomment ces helpers, qui projettent l'état du store (`useTunnelStore`)
 * vers les prédicats/validateurs du moteur (`@/core/tunnel`).
 */

import { useMemo } from "react";
import {
    useTunnelStore,
    validateStep,
    type TunnelState,
    type TunnelStepKey,
} from "@/core/tunnel";

/** Reconstruit l'état sérialisable du tunnel à partir du store (source de vérité). */
export function useTunnelSnapshot(): TunnelState {
    const currentStep = useTunnelStore((store) => store.currentStep);
    const dossier = useTunnelStore((store) => store.dossier);
    const personnes = useTunnelStore((store) => store.personnes);
    const stepStatus = useTunnelStore((store) => store.stepStatus);

    return useMemo<TunnelState>(
        () => ({ currentStep, dossier, personnes, stepStatus }),
        [currentStep, dossier, personnes, stepStatus],
    );
}

/**
 * Erreurs de validation de l'étape, mappées par chemin de champ
 * (`dossier.<champ>` / `personnes.<index>.<champ>`).
 *
 * Les erreurs ne sont exposées qu'une fois l'étape marquée `invalid` (c.-à-d.
 * après une tentative de `goNext` bloquée), puis se mettent à jour en direct au
 * fur et à mesure que l'utilisateur corrige sa saisie.
 */
export function useStepErrors(stepKey: TunnelStepKey): Record<string, string> {
    const state = useTunnelSnapshot();

    return useMemo(() => {
        if (state.stepStatus[stepKey] !== "invalid") {
            return {};
        }
        return validateStep(stepKey, state).errors;
    }, [stepKey, state]);
}
