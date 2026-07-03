/**
 * Étape `nationalite` — Naissance et nationalité (emprunteur + co-emprunteur).
 *
 * Étape MIXTE : affiche le bloc emprunteur et, si `has_coborrower`, le bloc
 * co-emprunteur. Champs : `birth_date`, `birth_country`, puis `nationality`
 * (masquée si né(e) en France, où la nationalité est forcée à `france`).
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { isCoborrowerVisible } from "@/core/tunnel";
import { useTunnelSnapshot } from "./useStepState";
import { NationalityFields } from "./personFields";

export const Nationalite: React.FC = () => {
    const state = useTunnelSnapshot();
    const withCoborrower = isCoborrowerVisible(state);

    return (
        <Stack gap={8}>
            <NationalityFields
                role="emprunteur"
                stepKey="nationalite"
                title={withCoborrower ? "Emprunteur" : undefined}
            />
            {withCoborrower && (
                <NationalityFields
                    role="co_emprunteur"
                    stepKey="nationalite"
                    title="Co-emprunteur"
                />
            )}
        </Stack>
    );
};

Nationalite.displayName = "Nationalite";

export default Nationalite;
