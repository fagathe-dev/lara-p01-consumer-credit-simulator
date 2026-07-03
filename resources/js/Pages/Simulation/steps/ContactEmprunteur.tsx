/**
 * Étape `contact_emprunteur` — Contact + consentements de l'emprunteur.
 *
 * Cible `personnes[0]` via le bloc réutilisable `ContactFields`.
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { ContactFields } from "./personFields";

export const ContactEmprunteur: React.FC = () => (
    <Stack gap={6}>
        <ContactFields role="emprunteur" stepKey="contact_emprunteur" />
    </Stack>
);

ContactEmprunteur.displayName = "ContactEmprunteur";

export default ContactEmprunteur;
