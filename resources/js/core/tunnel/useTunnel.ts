/**
 * `useTunnel` — façade au-dessus du store + de la navigation réelle.
 *
 * Préserve le contrat public déjà consommé par la page tunnel
 * (`steps`, `currentStep`, `progressPercent`, `goNext`, `goPrevious`) tout en
 * absorbant l'ancien stub : la logique "compteur + pourcentage" devient un
 * sous-ensemble de `useTunnelNavigation` (validation + saut d'étapes masquées).
 *
 * Au montage, la saisie persistée est réinjectée depuis
 * `StorageService('session')` via `hydrateFromStorage()`.
 */

import { useEffect, useRef } from "react";
import { TUNNEL_STEPS, type TunnelStepMeta } from "./config/steps";
import {
    useTunnelNavigation,
    type UseTunnelNavigationResult,
} from "./navigation/useTunnelNavigation";
import { useTunnelStore } from "./store/useTunnelStore";

export interface UseTunnelResult extends UseTunnelNavigationResult {
    /** Étapes déclarées (pour brancher `ProgressSteps`). */
    steps: readonly TunnelStepMeta[];
}

export function useTunnel(initialStep = 1): UseTunnelResult {
    const hydrateFromStorage = useTunnelStore(
        (store) => store.hydrateFromStorage,
    );
    const setCurrentStep = useTunnelStore((store) => store.setCurrentStep);
    const navigation = useTunnelNavigation();
    const bootstrapped = useRef(false);

    useEffect(() => {
        if (bootstrapped.current) {
            return;
        }
        bootstrapped.current = true;
        // La saisie persistée (dont l'étape courante) est prioritaire.
        hydrateFromStorage();
        // N'applique `initialStep` que si rien n'a été restauré.
        const restored = useTunnelStore.getState().currentStep;
        if (restored === 1 && initialStep !== 1) {
            setCurrentStep(initialStep);
        }
    }, [hydrateFromStorage, setCurrentStep, initialStep]);

    return {
        ...navigation,
        steps: TUNNEL_STEPS,
    };
}
