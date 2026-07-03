/**
 * Étape `pro_emprunteur` — Situation professionnelle de l'emprunteur.
 *
 * Cible `personnes[0]` via le bloc réutilisable `ProFields`. Étape mono-personne
 * (scope `borrower`) : pas de titre de bloc ni de garde recopiée ici.
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { ProFields } from "./personFields";

export const ProEmprunteur: React.FC = () => (
    <Stack gap={6}>
        <ProFields role="emprunteur" stepKey="pro_emprunteur" />
    </Stack>
);

ProEmprunteur.displayName = "ProEmprunteur";

export default ProEmprunteur;
