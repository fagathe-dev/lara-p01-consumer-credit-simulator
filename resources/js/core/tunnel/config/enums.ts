/**
 * Unions TypeScript miroir des Backed Enums PHP (`Core\Simulator\Enum\*`).
 *
 * Ces valeurs DOIVENT rester strictement alignées sur `docs/db.md` et sur les
 * enums PHP : toute désynchronisation front/back casse la validation serveur
 * (Form Requests Laravel), qui reste l'autorité finale.
 */

import type { ProjectType } from "@/core/products";

/** Ré-export pour que tout le moteur importe les enums depuis un point unique. */
export type { ProjectType };

/** `ProjectTypeEnum` — valeurs brutes. */
export const PROJECT_TYPES: readonly ProjectType[] = [
    "auto_moto",
    "regroupement_credits",
    "travaux",
    "autre",
    "famille_loisir",
] as const;

/** `FamilySituationEnum`. */
export type FamilySituation = "celibataire" | "marie" | "pacs" | "divorce_veuf";
export const FAMILY_SITUATIONS: readonly FamilySituation[] = [
    "celibataire",
    "marie",
    "pacs",
    "divorce_veuf",
] as const;

/** `HousingStatusEnum`. */
export type HousingStatus =
    | "fonction"
    | "proprietaire"
    | "heberge"
    | "locataire";
export const HOUSING_STATUSES: readonly HousingStatus[] = [
    "fonction",
    "proprietaire",
    "heberge",
    "locataire",
] as const;

/** `PersonRoleEnum`. */
export type PersonRole = "emprunteur" | "co_emprunteur";
export const PERSON_ROLES: readonly PersonRole[] = [
    "emprunteur",
    "co_emprunteur",
] as const;

/** `CivilityEnum`. */
export type Civility = "m" | "mme" | "autre";
export const CIVILITIES: readonly Civility[] = ["m", "mme", "autre"] as const;

/** `BirthCountryEnum` / `NationalityEnum` (mêmes cases). */
export type BirthCountry = "france" | "ue" | "hors_ue";
export type Nationality = BirthCountry;
export const BIRTH_COUNTRIES: readonly BirthCountry[] = [
    "france",
    "ue",
    "hors_ue",
] as const;

/** `EmploymentContractEnum`. */
export type EmploymentContract = "cdi" | "stage" | "interim" | "cdd" | "autre";
export const EMPLOYMENT_CONTRACTS: readonly EmploymentContract[] = [
    "cdi",
    "stage",
    "interim",
    "cdd",
    "autre",
] as const;

/** `ProfessionalSectorEnum` — codes entiers (2 chiffres). */
export type ProfessionalSector = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80;
export const PROFESSIONAL_SECTORS: readonly ProfessionalSector[] = [
    10, 20, 30, 40, 50, 60, 70, 80,
] as const;

/**
 * `ProfessionalJobEnum` — codes composites (secteur × 100 + profession),
 * strictement identiques aux cases PHP.
 */
export type ProfessionalJob =
    // Privé (10xx)
    | 1001
    | 1002
    | 1003
    | 1004
    | 1005
    | 1006
    | 1007
    | 1008
    | 1009
    | 1010
    // Public (20xx)
    | 2001
    | 2002
    | 2003
    | 2004
    | 2005
    // Agricole (30xx)
    | 3001
    | 3002
    // Indépendant (40xx)
    | 4001
    | 4002
    | 4003
    | 4004
    | 4005
    | 4006
    // Retraité (50xx)
    | 5001
    | 5002
    // Étudiant (60xx)
    | 6001
    // Chômeur (70xx)
    | 7001
    // Inactif (80xx)
    | 8001
    | 8002;

export const PROFESSIONAL_JOBS: readonly ProfessionalJob[] = [
    1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 2001, 2002,
    2003, 2004, 2005, 3001, 3002, 4001, 4002, 4003, 4004, 4005, 4006, 5001,
    5002, 6001, 7001, 8001, 8002,
] as const;

/**
 * Secteur parent d'une profession — miroir de `ProfessionalJobEnum::sector()`
 * (`intdiv($value, 100)`).
 */
export function sectorOfJob(job: ProfessionalJob): ProfessionalSector {
    return Math.trunc(job / 100) as ProfessionalSector;
}

/**
 * Professions disponibles pour un secteur — miroir de
 * `ProfessionalSectorEnum::professions()`. Utilisé pour filtrer dynamiquement
 * la liste `professional_job` selon le `professional_sector` sélectionné.
 */
export function jobsForSector(
    sector: ProfessionalSector,
): readonly ProfessionalJob[] {
    return PROFESSIONAL_JOBS.filter((job) => sectorOfJob(job) === sector);
}

/**
 * Indique si un secteur implique un contrat de travail (`employment_contract`).
 * Les secteurs sans activité salariée (retraité, étudiant, chômeur, inactif)
 * ne demandent pas de type de contrat (cf. `specs.md`).
 */
export function sectorHasEmploymentContract(
    sector: ProfessionalSector,
): boolean {
    return sector === 10 || sector === 20 || sector === 30 || sector === 40;
}
