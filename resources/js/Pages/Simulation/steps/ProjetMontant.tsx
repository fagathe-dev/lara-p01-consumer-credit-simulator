/**
 * Étape `projet_montant` — Montant et durée.
 *
 * Champs `dossier` : `project_amount` (MoneyInput), `project_duration`
 * (Select, `PROJECT_DURATIONS`). Les deux champs s'empilent sur mobile.
 */

import React from "react";
import { MoneyInput, Select } from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { theme } from "@/ui/theme";
import { PROJECT_DURATIONS, useTunnelStore } from "@/core/tunnel";
import { useStepErrors } from "./useStepState";

const durationOptions = [
    { value: "", label: "Sélectionnez une durée" },
    ...PROJECT_DURATIONS.map((months) => ({
        value: months,
        label: `${months} mois`,
    })),
];

export const ProjetMontant: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const errors = useStepErrors("projet_montant");

    return (
        <Stack gap={6}>
            <Grid columns={2} gap={4} collapseBelow={theme.breakpoints.sm}>
                <MoneyInput
                    label="Montant souhaité"
                    value={dossier.project_amount ?? ""}
                    onChange={(event) =>
                        setField(
                            "project_amount",
                            event.target.value === ""
                                ? null
                                : Number(event.target.value),
                        )
                    }
                    error={errors["dossier.project_amount"]}
                />

                <Select
                    label="Durée de remboursement"
                    options={durationOptions}
                    value={dossier.project_duration ?? ""}
                    onChange={(event) =>
                        setField(
                            "project_duration",
                            event.target.value === ""
                                ? null
                                : Number(event.target.value),
                        )
                    }
                    error={errors["dossier.project_duration"]}
                />
            </Grid>
        </Stack>
    );
};

ProjetMontant.displayName = "ProjetMontant";

export default ProjetMontant;
