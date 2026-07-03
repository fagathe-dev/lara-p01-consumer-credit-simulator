/**
 * Étape `situation_familiale` — Situation familiale + co-emprunteur.
 *
 * Champs `dossier` : `family_situation`, `family_situation_year` (si
 * marié/pacs/divorcé-veuf), `has_coborrower` (Switch). L'ajout du
 * co-emprunteur active/retire les étapes co-emprunteur du parcours.
 */

import React from "react";
import { Field, Input, Select, Switch } from "@/ui/components/Forms";
import { Stack } from "@/ui/components/Layout";
import {
    FAMILY_SITUATIONS,
    isDossierFieldVisible,
    useTunnelStore,
    type FamilySituation,
} from "@/core/tunnel";
import { useStepErrors, useTunnelSnapshot } from "./useStepState";

const FAMILY_LABELS: Record<FamilySituation, string> = {
    celibataire: "Célibataire",
    marie: "Marié(e)",
    pacs: "PACS",
    divorce_veuf: "Divorcé(e) / Veuf(ve)",
};

const familyOptions = [
    { value: "", label: "Sélectionnez votre situation" },
    ...FAMILY_SITUATIONS.map((value) => ({
        value,
        label: FAMILY_LABELS[value],
    })),
];

export const SituationFamiliale: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const toggleCoborrower = useTunnelStore((store) => store.toggleCoborrower);
    const state = useTunnelSnapshot();
    const errors = useStepErrors("situation_familiale");

    return (
        <Stack gap={6}>
            <Select
                label="Situation familiale"
                options={familyOptions}
                value={dossier.family_situation ?? ""}
                onChange={(event) =>
                    setField(
                        "family_situation",
                        event.target.value === ""
                            ? null
                            : (event.target.value as FamilySituation),
                    )
                }
                error={errors["dossier.family_situation"]}
            />

            {isDossierFieldVisible("family_situation_year", state) && (
                <Input
                    label="Année de la situation (AAAA)"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2018"
                    value={dossier.family_situation_year ?? ""}
                    onChange={(event) =>
                        setField(
                            "family_situation_year",
                            event.target.value === ""
                                ? null
                                : event.target.value,
                        )
                    }
                    error={errors["dossier.family_situation_year"]}
                />
            )}

            <Field label="Ajouter un co-emprunteur">
                <Switch
                    label="Je souhaite emprunter avec un co-emprunteur"
                    checked={dossier.has_coborrower}
                    onChange={(event) => toggleCoborrower(event.target.checked)}
                />
            </Field>
        </Stack>
    );
};

SituationFamiliale.displayName = "SituationFamiliale";

export default SituationFamiliale;
