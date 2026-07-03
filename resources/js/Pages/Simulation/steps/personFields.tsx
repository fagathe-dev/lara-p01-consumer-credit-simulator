/**
 * Blocs de champs réutilisables par personne (emprunteur / co-emprunteur).
 *
 * Ces blocs factorisent les champs `personne` partagés entre étapes mono-personne
 * (emprunteur ou co-emprunteur) et étapes mixtes (civilité / nationalité, qui
 * affichent les deux personnes). Chaque bloc :
 * - cible la personne via son `role` (l'index réel du store en dérive) ;
 * - lit ses erreurs via la clé d'étape (`stepKey`) fournie ;
 * - respecte la visibilité conditionnelle du moteur (`isPersonneFieldVisible`).
 *
 * Aucune logique de navigation ni de validation ici : uniquement de la saisie.
 */

import React from "react";
import { Checkbox, Field, Input, Select, Switch } from "@/ui/components/Forms";
import { Grid, Stack } from "@/ui/components/Layout";
import { Text } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import {
    BIRTH_COUNTRIES,
    CIVILITIES,
    EMPLOYMENT_CONTRACTS,
    PROFESSIONAL_SECTORS,
    isPersonneFieldVisible,
    jobsForSector,
    useTunnelStore,
    type BirthCountry,
    type Civility,
    type EmploymentContract,
    type Nationality,
    type PersonRole,
    type ProfessionalJob,
    type ProfessionalSector,
    type TunnelStepKey,
} from "@/core/tunnel";
import { useStepErrors, useTunnelSnapshot } from "./useStepState";

const CIVILITY_LABELS: Record<Civility, string> = {
    m: "M.",
    mme: "Mme",
    autre: "Autre",
};

const COUNTRY_LABELS: Record<BirthCountry, string> = {
    france: "France",
    ue: "Union Européenne",
    hors_ue: "Hors UE",
};

const SECTOR_LABELS: Record<ProfessionalSector, string> = {
    10: "Privé",
    20: "Public",
    30: "Agricole",
    40: "Indépendant / Libéral",
    50: "Retraité",
    60: "Étudiant",
    70: "Chômeur",
    80: "Inactif",
};

const JOB_LABELS: Record<ProfessionalJob, string> = {
    1001: "Cadre supérieur",
    1002: "Ingénieur",
    1003: "Cadre moyen",
    1004: "Technicien",
    1005: "Contremaître",
    1006: "Agent de sécurité",
    1007: "Employé",
    1008: "Ouvrier qualifié",
    1009: "Ouvrier non qualifié",
    1010: "Apprenti",
    2001: "Cadre supérieur (Public)",
    2002: "Cadre moyen (Public)",
    2003: "Ouvrier d'État",
    2004: "Militaire / Pompier",
    2005: "Aide soignant",
    3001: "Propriétaire agricole",
    3002: "Salarié agricole",
    4001: "Chef d'entreprise",
    4002: "Artisan",
    4003: "Commerçant",
    4004: "VRP",
    4005: "Profession libérale",
    4006: "Profession libérale (autre)",
    5001: "Retraité secteur privé",
    5002: "Retraité secteur public",
    6001: "Étudiant",
    7001: "Demandeur d'emploi",
    8001: "Sans profession",
    8002: "Invalide / Pensionné",
};

const CONTRACT_LABELS: Record<EmploymentContract, string> = {
    cdi: "CDI",
    stage: "Stage",
    interim: "Intérim",
    cdd: "CDD",
    autre: "Autre",
};

const civilityOptions = [
    { value: "", label: "Sélectionnez" },
    ...CIVILITIES.map((value) => ({ value, label: CIVILITY_LABELS[value] })),
];

const countryOptions = [
    { value: "", label: "Sélectionnez" },
    ...BIRTH_COUNTRIES.map((value) => ({
        value,
        label: COUNTRY_LABELS[value],
    })),
];

const sectorOptions = [
    { value: "", label: "Sélectionnez un secteur" },
    ...PROFESSIONAL_SECTORS.map((value) => ({
        value,
        label: SECTOR_LABELS[value],
    })),
];

const contractOptions = [
    { value: "", label: "Sélectionnez un contrat" },
    ...EMPLOYMENT_CONTRACTS.map((value) => ({
        value,
        label: CONTRACT_LABELS[value],
    })),
];

/** Titre de bloc, affiché uniquement pour les étapes mixtes (deux personnes). */
interface PersonBlockProps {
    role: PersonRole;
    stepKey: TunnelStepKey;
    /** Titre optionnel du bloc (ex. "Emprunteur" / "Co-emprunteur"). */
    title?: string;
}

/** Hook interne : personne ciblée + accès aux erreurs de l'étape. */
function usePersonBlock(role: PersonRole, stepKey: TunnelStepKey) {
    const personnes = useTunnelStore((store) => store.personnes);
    const setPersonneField = useTunnelStore((store) => store.setPersonneField);
    const state = useTunnelSnapshot();
    const errors = useStepErrors(stepKey);

    const index = personnes.findIndex((person) => person.role === role);
    const person = index >= 0 ? personnes[index] : undefined;
    const err = (field: string): string | undefined =>
        errors[`personnes.${index}.${field}`];

    return { person, index, setPersonneField, state, err };
}

/** Champs de situation professionnelle d'une personne. */
export const ProFields: React.FC<PersonBlockProps> = ({
    role,
    stepKey,
    title,
}) => {
    const { person, setPersonneField, state, err } = usePersonBlock(
        role,
        stepKey,
    );
    if (!person) {
        return null;
    }

    const jobOptions = person.professional_sector
        ? [
              { value: "", label: "Sélectionnez une profession" },
              ...jobsForSector(person.professional_sector).map((value) => ({
                  value,
                  label: JOB_LABELS[value],
              })),
          ]
        : [];

    return (
        <Stack gap={5}>
            {title && (
                <Text as="span" weight="semibold">
                    {title}
                </Text>
            )}

            <Select
                label="Secteur d'activité"
                options={sectorOptions}
                value={person.professional_sector ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "professional_sector",
                        event.target.value === ""
                            ? null
                            : (Number(
                                  event.target.value,
                              ) as ProfessionalSector),
                    )
                }
                error={err("professional_sector")}
            />

            {isPersonneFieldVisible("professional_job", person, state) && (
                <Select
                    label="Profession"
                    options={jobOptions}
                    value={person.professional_job ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "professional_job",
                            event.target.value === ""
                                ? null
                                : (Number(
                                      event.target.value,
                                  ) as ProfessionalJob),
                        )
                    }
                    error={err("professional_job")}
                />
            )}

            {isPersonneFieldVisible("employment_contract", person, state) && (
                <Select
                    label="Type de contrat"
                    options={contractOptions}
                    value={person.employment_contract ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "employment_contract",
                            event.target.value === ""
                                ? null
                                : (event.target.value as EmploymentContract),
                        )
                    }
                    error={err("employment_contract")}
                />
            )}

            {isPersonneFieldVisible(
                "probation_period_ended",
                person,
                state,
            ) && (
                <Field
                    label="Période d'essai"
                    error={err("probation_period_ended")}
                >
                    <Switch
                        label="Ma période d'essai est terminée"
                        checked={person.probation_period_ended === true}
                        onChange={(event) =>
                            setPersonneField(
                                role,
                                "probation_period_ended",
                                event.target.checked,
                            )
                        }
                    />
                </Field>
            )}

            <Input
                label="Depuis quand (MM/AAAA)"
                placeholder="01/2021"
                value={person.professional_situation_date ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "professional_situation_date",
                        event.target.value === "" ? null : event.target.value,
                    )
                }
                error={err("professional_situation_date")}
            />
        </Stack>
    );
};

ProFields.displayName = "ProFields";

/** Champs d'état civil (civilité, nom, nom de naissance, prénom). */
export const CivilityFields: React.FC<PersonBlockProps> = ({
    role,
    stepKey,
    title,
}) => {
    const { person, setPersonneField, state, err } = usePersonBlock(
        role,
        stepKey,
    );
    if (!person) {
        return null;
    }

    return (
        <Stack gap={5}>
            {title && (
                <Text as="span" weight="semibold">
                    {title}
                </Text>
            )}

            <Select
                label="Civilité"
                options={civilityOptions}
                value={person.civility ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "civility",
                        event.target.value === ""
                            ? null
                            : (event.target.value as Civility),
                    )
                }
                error={err("civility")}
            />

            <Grid columns={2} gap={4} collapseBelow={theme.breakpoints.sm}>
                <Input
                    label="Nom"
                    value={person.last_name ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "last_name",
                            event.target.value === ""
                                ? null
                                : event.target.value,
                        )
                    }
                    error={err("last_name")}
                />

                <Input
                    label="Prénom"
                    value={person.first_name ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "first_name",
                            event.target.value === ""
                                ? null
                                : event.target.value,
                        )
                    }
                    error={err("first_name")}
                />
            </Grid>

            {isPersonneFieldVisible("maiden_name", person, state) && (
                <Input
                    label="Nom de naissance"
                    value={person.maiden_name ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "maiden_name",
                            event.target.value === ""
                                ? null
                                : event.target.value,
                        )
                    }
                    error={err("maiden_name")}
                />
            )}
        </Stack>
    );
};

CivilityFields.displayName = "CivilityFields";

/** Champs de naissance et nationalité. */
export const NationalityFields: React.FC<PersonBlockProps> = ({
    role,
    stepKey,
    title,
}) => {
    const { person, setPersonneField, state, err } = usePersonBlock(
        role,
        stepKey,
    );
    if (!person) {
        return null;
    }

    return (
        <Stack gap={5}>
            {title && (
                <Text as="span" weight="semibold">
                    {title}
                </Text>
            )}

            <Input
                type="date"
                label="Date de naissance"
                value={person.birth_date ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "birth_date",
                        event.target.value === "" ? null : event.target.value,
                    )
                }
                error={err("birth_date")}
            />

            <Select
                label="Pays de naissance"
                options={countryOptions}
                value={person.birth_country ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "birth_country",
                        event.target.value === ""
                            ? null
                            : (event.target.value as BirthCountry),
                    )
                }
                error={err("birth_country")}
            />

            {/* Nationalité masquée si né(e) en France (forcée à `france`). */}
            {isPersonneFieldVisible("nationality", person, state) && (
                <Select
                    label="Nationalité"
                    options={countryOptions}
                    value={person.nationality ?? ""}
                    onChange={(event) =>
                        setPersonneField(
                            role,
                            "nationality",
                            event.target.value === ""
                                ? null
                                : (event.target.value as Nationality),
                        )
                    }
                    error={err("nationality")}
                />
            )}
        </Stack>
    );
};

NationalityFields.displayName = "NationalityFields";

/** Champs de contact et consentements RGPD. */
export const ContactFields: React.FC<PersonBlockProps> = ({
    role,
    stepKey,
    title,
}) => {
    const { person, setPersonneField, err } = usePersonBlock(role, stepKey);
    if (!person) {
        return null;
    }

    return (
        <Stack gap={5}>
            {title && (
                <Text as="span" weight="semibold">
                    {title}
                </Text>
            )}

            <Input
                type="tel"
                label="Téléphone"
                placeholder="06 12 34 56 78"
                value={person.phone ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "phone",
                        event.target.value === "" ? null : event.target.value,
                    )
                }
                error={err("phone")}
            />

            <Input
                type="email"
                label="Adresse e-mail"
                placeholder="prenom.nom@exemple.fr"
                value={person.email ?? ""}
                onChange={(event) =>
                    setPersonneField(
                        role,
                        "email",
                        event.target.value === "" ? null : event.target.value,
                    )
                }
                error={err("email")}
            />

            <Field label="Consentements" error={err("consent_data_usage")}>
                <Stack gap={3}>
                    <Checkbox
                        label="J'autorise l'utilisation de mes données pour l'étude de ma demande."
                        checked={person.consent_data_usage}
                        onChange={(event) =>
                            setPersonneField(
                                role,
                                "consent_data_usage",
                                event.target.checked,
                            )
                        }
                    />
                    <Checkbox
                        label="J'accepte d'être contacté(e) par un conseiller."
                        checked={person.consent_canvassing}
                        onChange={(event) =>
                            setPersonneField(
                                role,
                                "consent_canvassing",
                                event.target.checked,
                            )
                        }
                    />
                    <Checkbox
                        label="J'accepte de recevoir des offres commerciales."
                        checked={person.consent_advertising}
                        onChange={(event) =>
                            setPersonneField(
                                role,
                                "consent_advertising",
                                event.target.checked,
                            )
                        }
                    />
                </Stack>
            </Field>
        </Stack>
    );
};

ContactFields.displayName = "ContactFields";
