/**
 * Étape `revenus` — Revenus mensuels.
 *
 * Champs `dossier` : `income_net_monthly` (requis) + `income_rental`,
 * `income_allowance`, `income_other` (optionnels). Les revenus s'organisent en
 * grille aérée sur desktop et s'empilent sur mobile.
 */

import React from "react";
import { MoneyInput } from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { theme } from "@/ui/theme";
import { useTunnelStore } from "@/core/tunnel";
import { useStepErrors } from "./useStepState";

export const Revenus: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const errors = useStepErrors("revenus");

    return (
        <Stack gap={5}>
            <MoneyInput
                label="Revenu net mensuel"
                value={dossier.income_net_monthly ?? ""}
                onChange={(event) =>
                    setField(
                        "income_net_monthly",
                        event.target.value === ""
                            ? null
                            : Number(event.target.value),
                    )
                }
                error={errors["dossier.income_net_monthly"]}
            />

            <Grid columns={2} gap={4} collapseBelow={theme.breakpoints.sm}>
                <MoneyInput
                    label="Revenus fonciers (optionnel)"
                    value={dossier.income_rental ?? ""}
                    onChange={(event) =>
                        setField(
                            "income_rental",
                            event.target.value === ""
                                ? null
                                : Number(event.target.value),
                        )
                    }
                    error={errors["dossier.income_rental"]}
                />

                <MoneyInput
                    label="Allocations (optionnel)"
                    value={dossier.income_allowance ?? ""}
                    onChange={(event) =>
                        setField(
                            "income_allowance",
                            event.target.value === ""
                                ? null
                                : Number(event.target.value),
                        )
                    }
                    error={errors["dossier.income_allowance"]}
                />
            </Grid>

            <MoneyInput
                label="Autres revenus (optionnel)"
                value={dossier.income_other ?? ""}
                onChange={(event) =>
                    setField(
                        "income_other",
                        event.target.value === ""
                            ? null
                            : Number(event.target.value),
                    )
                }
                error={errors["dossier.income_other"]}
            />
        </Stack>
    );
};

Revenus.displayName = "Revenus";

export default Revenus;
