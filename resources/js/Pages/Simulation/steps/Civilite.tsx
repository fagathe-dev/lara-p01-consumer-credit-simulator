/**
 * Étape `civilite` — État civil (emprunteur + co-emprunteur).
 *
 * Étape MIXTE : affiche le bloc emprunteur et, si `has_coborrower`, le bloc
 * co-emprunteur, chacun écrivant sur sa propre personne. Champs : `civility`,
 * `last_name`, `maiden_name` (si Mme + cas marital), `first_name`.
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { isCoborrowerVisible } from "@/core/tunnel";
import { useTunnelSnapshot } from "./useStepState";
import { CivilityFields } from "./personFields";

export const Civilite: React.FC = () => {
    const state = useTunnelSnapshot();
    const withCoborrower = isCoborrowerVisible(state);

    return (
        <Stack gap={8}>
            <CivilityFields
                role="emprunteur"
                stepKey="civilite"
                title={withCoborrower ? "Emprunteur" : undefined}
            />
            {withCoborrower && (
                <CivilityFields
                    role="co_emprunteur"
                    stepKey="civilite"
                    title="Co-emprunteur"
                />
            )}
        </Stack>
    );
};

Civilite.displayName = "Civilite";

export default Civilite;
