/**
 * Étape `projet_type` — Type de projet.
 *
 * Champ `dossier` : `project_type` (SelectableCard, variante `card`).
 * Vue pure branchée au store : aucune logique de navigation ici.
 */

import React from "react";
import { Field, SelectableCard } from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { theme } from "@/ui/theme";
import { useTunnelStore } from "@/core/tunnel";
import { products, type ProjectType } from "@/core/products";
import { useStepErrors } from "./useStepState";

/** Pictogramme par type de projet (variante `card`). */
const PROJECT_ICONS: Record<ProjectType, string> = {
    auto_moto: "🚗",
    regroupement_credits: "🔄",
    travaux: "🔨",
    autre: "💶",
    famille_loisir: "🎉",
};

export const ProjetType: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const errors = useStepErrors("projet_type");

    return (
        <Stack gap={6}>
            <Field
                label="Quel est votre projet ?"
                error={errors["dossier.project_type"]}
            >
                <Grid columns={3} gap={3} collapseBelow={theme.breakpoints.sm}>
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
        </Stack>
    );
};

ProjetType.displayName = "ProjetType";

export default ProjetType;
