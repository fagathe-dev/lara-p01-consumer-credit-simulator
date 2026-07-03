/**
 * Étape `contact_coemprunteur` — Contact + consentements du co-emprunteur.
 *
 * Cible `personnes[1]` via le bloc réutilisable `ContactFields`. Étape scope
 * `coborrower` : jamais atteinte si `has_coborrower === false`.
 */

import React from "react";
import { Stack } from "@/ui/components/Layout";
import { ContactFields } from "./personFields";

export const ContactCoEmprunteur: React.FC = () => (
    <Stack gap={6}>
        <ContactFields role="co_emprunteur" stepKey="contact_coemprunteur" />
    </Stack>
);

ContactCoEmprunteur.displayName = "ContactCoEmprunteur";

export default ContactCoEmprunteur;
