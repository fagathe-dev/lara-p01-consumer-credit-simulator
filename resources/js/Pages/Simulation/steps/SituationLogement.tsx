/**
 * Étape `situation_logement` — Situation logement.
 *
 * Champs `dossier` : `housing_status`, `housing_status_year` (si
 * propriétaire/locataire).
 */

import React from "react";
import { Input, Select } from "@/ui/components/Forms";
import { Stack } from "@/ui/components/Layout";
import {
    HOUSING_STATUSES,
    isDossierFieldVisible,
    useTunnelStore,
    type HousingStatus,
} from "@/core/tunnel";
import { useStepErrors, useTunnelSnapshot } from "./useStepState";

const HOUSING_LABELS: Record<HousingStatus, string> = {
    fonction: "Logement de fonction",
    proprietaire: "Propriétaire",
    heberge: "Hébergé",
    locataire: "Locataire",
};

const housingOptions = [
    { value: "", label: "Sélectionnez votre logement" },
    ...HOUSING_STATUSES.map((value) => ({
        value,
        label: HOUSING_LABELS[value],
    })),
];

export const SituationLogement: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const state = useTunnelSnapshot();
    const errors = useStepErrors("situation_logement");

    return (
        <Stack gap={6}>
            <Select
                label="Statut de logement"
                options={housingOptions}
                value={dossier.housing_status ?? ""}
                onChange={(event) =>
                    setField(
                        "housing_status",
                        event.target.value === ""
                            ? null
                            : (event.target.value as HousingStatus),
                    )
                }
                error={errors["dossier.housing_status"]}
            />

            {isDossierFieldVisible("housing_status_year", state) && (
                <Input
                    label="Année d'emménagement (AAAA)"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2020"
                    value={dossier.housing_status_year ?? ""}
                    onChange={(event) =>
                        setField(
                            "housing_status_year",
                            event.target.value === ""
                                ? null
                                : event.target.value,
                        )
                    }
                    error={errors["dossier.housing_status_year"]}
                />
            )}
        </Stack>
    );
};

SituationLogement.displayName = "SituationLogement";

export default SituationLogement;
