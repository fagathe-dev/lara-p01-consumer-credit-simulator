/**
 * Étape 1 — Le projet.
 *
 * Champs `dossier` : `project_type`, `project_amount`, `project_duration`.
 * Vue pure branchée au store : aucune logique de navigation ici.
 */

import React from "react";
import {
    Field,
    MoneyInput,
    Select,
    SelectableCard,
} from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { PROJECT_DURATIONS, useTunnelStore } from "@/core/tunnel";
import { products, type ProjectType } from "@/core/products";
import { useStepErrors } from "./useStepState";
import {
    CarIcon,
    HammerIcon,
    HeartIcon,
    RefreshCwIcon,
    WalletIcon,
} from "lucide-react";

/** Pictogramme par type de projet (variante `card`). */
const PROJECT_ICONS: Record<ProjectType, React.ComponentType> = {
    auto_moto: CarIcon,
    regroupement_credits: RefreshCwIcon,
    travaux: HammerIcon,
    autre: WalletIcon,
    famille_loisir: HeartIcon,
};

const durationOptions = [
    { value: "", label: "Sélectionnez une durée" },
    ...PROJECT_DURATIONS.map((months) => ({
        value: months,
        label: `${months} mois`,
    })),
];

export const Step1Projet: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const errors = useStepErrors("projet");

    return (
        <Stack gap={6}>
            <Field
                label="Quel est votre projet ?"
                error={errors["dossier.project_type"]}
            >
                <Grid columns={3} gap={3} collapseBelow="640px">
                    {products.map((product) => (
                        <SelectableCard
                            key={product.type}
                            label={product.label}
                            icon={PROJECT_ICONS[product.type]}
                            selected={dossier.project_type === product.type}
                            onSelect={() =>
                                setField("project_type", product.type)
                            }
                        />
                    ))}
                </Grid>
            </Field>

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
        </Stack>
    );
};

Step1Projet.displayName = "Step1Projet";

export default Step1Projet;
