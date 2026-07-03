/**
 * Tunnel.tsx — ORCHESTRATEUR du tunnel de simulation.
 *
 * Responsabilité unique : afficher l'étape courante. Aucune logique de champ,
 * aucune validation, aucune navigation en dur ici — tout cela vit dans le
 * moteur (`@/core/tunnel`) et dans les composants d'étape (`./steps/*`).
 *
 * Le routage se fait PAR DONNÉE via `STEP_COMPONENTS[currentStepKey]`
 * (registre `steps/index.ts`), jamais par un `switch`/index magique.
 */

import React, { useEffect } from "react";
import { Seo } from "@/components/Seo";
import { TunnelLayout } from "@/components/Layouts";
import { useTunnelNavigation, useTunnelStore } from "@/core/tunnel";
import type { PageProps } from "@/types/seo";
import { STEP_COMPONENTS, StepShell } from "./steps";

interface TunnelProps extends PageProps {
    /** Montant pré-rempli fourni par le contrôleur (bootstrap de la saisie). */
    defaultAmount: number;
    /** Durée pré-remplie fournie par le contrôleur (bootstrap de la saisie). */
    defaultDuration: number;
}

const Tunnel: React.FC<TunnelProps> = ({
    seo,
    defaultAmount,
    defaultDuration,
}) => {
    const { currentStepKey } = useTunnelNavigation();

    // Réhydrate la saisie persistée puis amorce les valeurs par défaut du
    // contrôleur si rien n'a été restauré. Initialisation ponctuelle du
    // moteur — jamais de la logique de champ.
    useEffect(() => {
        const store = useTunnelStore.getState();
        store.hydrateFromStorage();
        const seeded = useTunnelStore.getState();
        if (seeded.dossier.project_amount == null) {
            seeded.setField("project_amount", defaultAmount);
        }
        if (seeded.dossier.project_duration == null) {
            seeded.setField("project_duration", defaultDuration);
        }
    }, [defaultAmount, defaultDuration]);

    // Routage par clé ; fallback défensif vers l'étape 1 si la clé est inconnue.
    const StepComponent = STEP_COMPONENTS[currentStepKey];
    if (!StepComponent) {
        console.error(
            `[Tunnel] Aucun composant pour l'étape « ${currentStepKey} » ; repli sur l'étape 1.`,
        );
    }
    const ResolvedStep = StepComponent ?? STEP_COMPONENTS.projet_type;

    return (
        <TunnelLayout>
            <Seo seo={seo} />
            <StepShell>
                <ResolvedStep />
            </StepShell>
        </TunnelLayout>
    );
};

export default Tunnel;
