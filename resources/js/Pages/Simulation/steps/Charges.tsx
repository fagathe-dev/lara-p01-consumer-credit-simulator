/**
 * Étape `charges` — Charges mensuelles.
 *
 * Champs `dossier` : `charge_housing`, `charge_mortgage_remaining` +
 * `housing_property_value` (si propriétaire), `has_active_consumer_credit` →
 * `charge_consumer_credit_monthly` / `_remaining`, `charge_other`.
 * L'affichage conditionnel dérive de `isDossierFieldVisible`.
 */

import React from "react";
import { Field, MoneyInput, Switch } from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { theme } from "@/ui/theme";
import { isDossierFieldVisible, useTunnelStore } from "@/core/tunnel";
import { useStepErrors, useTunnelSnapshot } from "./useStepState";

export const Charges: React.FC = () => {
    const dossier = useTunnelStore((store) => store.dossier);
    const setField = useTunnelStore((store) => store.setField);
    const state = useTunnelSnapshot();
    const errors = useStepErrors("charges");

    return (
        <Stack gap={5}>
            <MoneyInput
                label="Charge de logement (loyer ou mensualité)"
                value={dossier.charge_housing ?? ""}
                onChange={(event) =>
                    setField(
                        "charge_housing",
                        event.target.value === ""
                            ? null
                            : Number(event.target.value),
                    )
                }
                error={errors["dossier.charge_housing"]}
            />

            {(isDossierFieldVisible("charge_mortgage_remaining", state) ||
                isDossierFieldVisible("housing_property_value", state)) && (
                <Grid columns={2} gap={4} collapseBelow={theme.breakpoints.sm}>
                    {isDossierFieldVisible(
                        "charge_mortgage_remaining",
                        state,
                    ) && (
                        <MoneyInput
                            label="Crédit immobilier restant à payer"
                            value={dossier.charge_mortgage_remaining ?? ""}
                            onChange={(event) =>
                                setField(
                                    "charge_mortgage_remaining",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            error={
                                errors["dossier.charge_mortgage_remaining"]
                            }
                        />
                    )}

                    {isDossierFieldVisible(
                        "housing_property_value",
                        state,
                    ) && (
                        <MoneyInput
                            label="Valeur du bien"
                            value={dossier.housing_property_value ?? ""}
                            onChange={(event) =>
                                setField(
                                    "housing_property_value",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            error={errors["dossier.housing_property_value"]}
                        />
                    )}
                </Grid>
            )}

            <Field label="Crédit à la consommation en cours">
                <Switch
                    label="J'ai un ou plusieurs crédits à la consommation en cours"
                    checked={dossier.has_active_consumer_credit}
                    onChange={(event) =>
                        setField(
                            "has_active_consumer_credit",
                            event.target.checked,
                        )
                    }
                />
            </Field>

            {(isDossierFieldVisible(
                "charge_consumer_credit_monthly",
                state,
            ) ||
                isDossierFieldVisible(
                    "charge_consumer_credit_remaining",
                    state,
                )) && (
                <Grid columns={2} gap={4} collapseBelow={theme.breakpoints.sm}>
                    {isDossierFieldVisible(
                        "charge_consumer_credit_monthly",
                        state,
                    ) && (
                        <MoneyInput
                            label="Mensualité totale des crédits conso"
                            value={
                                dossier.charge_consumer_credit_monthly ?? ""
                            }
                            onChange={(event) =>
                                setField(
                                    "charge_consumer_credit_monthly",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            error={
                                errors[
                                    "dossier.charge_consumer_credit_monthly"
                                ]
                            }
                        />
                    )}

                    {isDossierFieldVisible(
                        "charge_consumer_credit_remaining",
                        state,
                    ) && (
                        <MoneyInput
                            label="Capital restant dû des crédits conso"
                            value={
                                dossier.charge_consumer_credit_remaining ?? ""
                            }
                            onChange={(event) =>
                                setField(
                                    "charge_consumer_credit_remaining",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            error={
                                errors[
                                    "dossier.charge_consumer_credit_remaining"
                                ]
                            }
                        />
                    )}
                </Grid>
            )}

            <MoneyInput
                label="Autres charges (optionnel)"
                value={dossier.charge_other ?? ""}
                onChange={(event) =>
                    setField(
                        "charge_other",
                        event.target.value === ""
                            ? null
                            : Number(event.target.value),
                    )
                }
                error={errors["dossier.charge_other"]}
            />
        </Stack>
    );
};

Charges.displayName = "Charges";

export default Charges;
