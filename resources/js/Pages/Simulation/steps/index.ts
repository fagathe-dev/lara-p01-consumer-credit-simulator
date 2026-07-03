/**
 * Registre des composants d'étape du tunnel.
 *
 * Associe chaque `TunnelStepKey` du moteur à son composant, pour que
 * l'orchestrateur (`Tunnel.tsx`) route PAR DONNÉE (clé d'étape) et non via un
 * `switch`/index magique. Les clés doivent correspondre exactement aux `key`
 * de `TUNNEL_STEPS` : toute divergence est une erreur de cohérence.
 */

import React from "react";
import type { TunnelStepKey } from "@/core/tunnel";
import ProjetType from "./ProjetType";
import ProjetMontant from "./ProjetMontant";
import SituationFamiliale from "./SituationFamiliale";
import SituationLogement from "./SituationLogement";
import ProEmprunteur from "./ProEmprunteur";
import ProCoEmprunteur from "./ProCoEmprunteur";
import Revenus from "./Revenus";
import Charges from "./Charges";
import Civilite from "./Civilite";
import Nationalite from "./Nationalite";
import ContactEmprunteur from "./ContactEmprunteur";
import ContactCoEmprunteur from "./ContactCoEmprunteur";

/** Registre { clé d'étape → composant }. */
export const STEP_COMPONENTS: Record<TunnelStepKey, React.ComponentType> = {
    projet_type: ProjetType,
    projet_montant: ProjetMontant,
    situation_familiale: SituationFamiliale,
    situation_logement: SituationLogement,
    pro_emprunteur: ProEmprunteur,
    pro_coemprunteur: ProCoEmprunteur,
    revenus: Revenus,
    charges: Charges,
    civilite: Civilite,
    nationalite: Nationalite,
    contact_emprunteur: ContactEmprunteur,
    contact_coemprunteur: ContactCoEmprunteur,
};

export { default as StepShell } from "./StepShell";
export { default as ProjetType } from "./ProjetType";
export { default as ProjetMontant } from "./ProjetMontant";
export { default as SituationFamiliale } from "./SituationFamiliale";
export { default as SituationLogement } from "./SituationLogement";
export { default as ProEmprunteur } from "./ProEmprunteur";
export { default as ProCoEmprunteur } from "./ProCoEmprunteur";
export { default as Revenus } from "./Revenus";
export { default as Charges } from "./Charges";
export { default as Civilite } from "./Civilite";
export { default as Nationalite } from "./Nationalite";
export { default as ContactEmprunteur } from "./ContactEmprunteur";
export { default as ContactCoEmprunteur } from "./ContactCoEmprunteur";
