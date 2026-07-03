/**
 * Navigation du tunnel — hook branché sur le store + la validation + la
 * visibilité des étapes/sections.
 *
 * Deux granularités exposées :
 * - ÉTAPES (fin) : `currentStep` / `totalVisibleSteps` / `progressPercent`
 *   pilotent la barre de progression, qui avance à CHAQUE étape.
 * - SECTIONS (grossier) : `sections` / `currentSectionKey` pilotent le stepper.
 *
 * Règles clés :
 * - `goNext()` valide l'étape courante avant d'avancer (garde de navigation).
 * - Les étapes co-emprunteur masquées (`has_coborrower === false`) sont sautées.
 * - `progressPercent = currentStep / totalVisibleSteps * 100` (sur les étapes
 *   VISIBLES) → la barre avance même entre deux étapes d'une même section.
 */

import { useCallback, useMemo } from "react";
import {
    TUNNEL_SECTIONS,
    getStepByKey,
    getStepByOrder,
    getVisibleSteps,
    isStepInScope,
    type TunnelSectionKey,
    type TunnelStepKey,
} from "../config/steps";
import { validateStep } from "../schema/dossierSchema";
import { useTunnelStore } from "../store/useTunnelStore";
import type { TunnelState } from "../store/types";

/** Statut d'une section dans le stepper. */
export type SectionStatus = "done" | "current" | "upcoming";

export interface NavigationSection {
    key: TunnelSectionKey;
    label: string;
    status: SectionStatus;
}

export interface UseTunnelNavigationResult {
    // --- Étapes (granularité fine → barre de progression) ---
    /** Étape courante, 1-based dans les étapes VISIBLES. */
    currentStep: number;
    currentStepKey: TunnelStepKey;
    /** Nombre total d'étapes visibles (10 ou 12 selon `has_coborrower`). */
    totalVisibleSteps: number;
    /** Progression 0..100 sur les étapes visibles (avance à chaque étape). */
    progressPercent: number;

    // --- Sections (granularité grossière → stepper) ---
    currentSectionKey: TunnelSectionKey;
    sections: NavigationSection[];

    isFirstStep: boolean;
    isLastStep: boolean;
    /** `false` si l'étape courante est invalide. */
    canGoNext: boolean;
    /** Valide puis avance vers la prochaine étape visible ; `false` si bloqué. */
    goNext: () => boolean;
    /** Recule vers l'étape visible précédente. */
    goPrevious: () => void;
    /** Refusé (retourne `false`) si l'étape n'est pas atteignable. */
    goToStep: (step: number | TunnelStepKey) => boolean;
}

export function useTunnelNavigation(): UseTunnelNavigationResult {
    const store = useTunnelStore();
    const { currentStep: currentOrder, setCurrentStep, markStep } = store;

    // Le state sérialisable (sans les actions) consommé par validation/visibilité.
    const state = useMemo<TunnelState>(
        () => ({
            currentStep: store.currentStep,
            dossier: store.dossier,
            personnes: store.personnes,
            stepStatus: store.stepStatus,
        }),
        [store.currentStep, store.dossier, store.personnes, store.stepStatus],
    );

    const visible = useMemo(() => getVisibleSteps(state), [state]);

    // Index (0-based) de l'étape courante parmi les étapes visibles.
    const currentVisibleIndex = useMemo(() => {
        const index = visible.findIndex((step) => step.order === currentOrder);
        return index === -1 ? 0 : index;
    }, [visible, currentOrder]);

    const currentStepMeta = visible[currentVisibleIndex] ?? visible[0];
    const currentStepKey = currentStepMeta.key;

    const totalVisibleSteps = visible.length;
    const currentStep = currentVisibleIndex + 1;
    const isFirstStep = currentVisibleIndex <= 0;
    const isLastStep = currentVisibleIndex === totalVisibleSteps - 1;

    const progressPercent = useMemo(() => {
        if (totalVisibleSteps <= 0) {
            return 0;
        }
        return Math.round((currentStep / totalVisibleSteps) * 100);
    }, [currentStep, totalVisibleSteps]);

    const currentSectionKey = getStepByKey(currentStepKey).sectionKey;

    const sections = useMemo<NavigationSection[]>(() => {
        return TUNNEL_SECTIONS.map((section) => {
            const visibleStepKeys = section.stepKeys.filter((key) =>
                isStepInScope(getStepByKey(key), state),
            );
            const isCurrent = visibleStepKeys.includes(currentStepKey);
            let status: SectionStatus;
            if (isCurrent) {
                status = "current";
            } else if (
                visibleStepKeys.length > 0 &&
                visibleStepKeys.every(
                    (key) => state.stepStatus[key] === "valid",
                )
            ) {
                status = "done";
            } else {
                status = "upcoming";
            }
            return { key: section.key, label: section.label, status };
        });
    }, [state, currentStepKey]);

    const canGoNext = useMemo(
        () => validateStep(currentStepKey, state).valid,
        [currentStepKey, state],
    );

    const goNext = useCallback((): boolean => {
        const result = validateStep(currentStepKey, state);
        if (!result.valid) {
            markStep(currentStepKey, "invalid");
            return false;
        }
        markStep(currentStepKey, "valid");
        const next = visible[currentVisibleIndex + 1];
        if (!next) {
            // Dernière étape visible : validée, rien à faire de plus.
            return true;
        }
        setCurrentStep(next.order);
        return true;
    }, [
        currentStepKey,
        state,
        visible,
        currentVisibleIndex,
        markStep,
        setCurrentStep,
    ]);

    const goPrevious = useCallback((): void => {
        const previous = visible[currentVisibleIndex - 1];
        if (previous) {
            setCurrentStep(previous.order);
        }
    }, [visible, currentVisibleIndex, setCurrentStep]);

    const goToStep = useCallback(
        (step: number | TunnelStepKey): boolean => {
            const target =
                typeof step === "number"
                    ? getStepByOrder(step)
                    : getStepByKey(step);
            if (!target) {
                return false;
            }
            const targetVisibleIndex = visible.findIndex(
                (s) => s.order === target.order,
            );
            // Étape masquée ou non atteignable.
            if (targetVisibleIndex === -1) {
                return false;
            }
            // Autorisé : reculer librement, ou avancer d'une seule étape validée.
            if (targetVisibleIndex <= currentVisibleIndex) {
                setCurrentStep(target.order);
                return true;
            }
            if (targetVisibleIndex === currentVisibleIndex + 1) {
                return goNext();
            }
            return false;
        },
        [visible, currentVisibleIndex, setCurrentStep, goNext],
    );

    return {
        currentStep,
        currentStepKey,
        totalVisibleSteps,
        progressPercent,
        currentSectionKey,
        sections,
        isFirstStep,
        isLastStep,
        canGoNext,
        goNext,
        goPrevious,
        goToStep,
    };
}
