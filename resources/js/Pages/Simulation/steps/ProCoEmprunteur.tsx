/**
 * Étape `pro_coemprunteur` — Situation professionnelle du co-emprunteur.
 *
 * Cible `personnes[1]` via le bloc réutilisable `ProFields`. Étape scope
 * `coborrower` : la navigation ne l'atteint jamais si `has_coborrower === false`
 * (pas de garde recopiée ici).
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { ProFields } from "./personFields";

export const ProCoEmprunteur: React.FC = () => (
    <Stack gap={6}>
        <ProFields role="co_emprunteur" stepKey="pro_coemprunteur" />
    </Stack>
);

ProCoEmprunteur.displayName = "ProCoEmprunteur";

export default ProCoEmprunteur;
