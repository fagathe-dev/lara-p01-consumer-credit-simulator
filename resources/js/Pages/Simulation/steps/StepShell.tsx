/**
 * StepShell — coquille commune à toutes les étapes du tunnel.
 *
 * Factorise ce qui est identique d'une étape à l'autre pour que chaque `StepX`
 * ne contienne QUE ses champs :
 * - header de progression (`ProgressSteps` + `ProgressBar`) branché sur le moteur ;
 * - titre d'étape (issu de `TUNNEL_STEPS`) + sous-titre commercial ;
 * - zone de contenu (`children`) ;
 * - barre de navigation ("Précédent" / "Suivant" / "Valider ma demande").
 *
 * La coquille ne réimplémente NI la validation NI la navigation : le bouton
 * "Suivant" délègue à `goNext()` (qui valide et bloque si l'étape est invalide)
 * et, sur la dernière étape, déclenche la soumission via `useTunnelSubmission`.
 */

import React, { useCallback } from "react";
import styled from "styled-components";
import { Container, Flex, Stack } from "@/ui/components/Layout";
import { Card } from "@/ui/components/Widgets";
import { Title, Text } from "@/ui/components/Typography";
import { Button } from "@/ui/components/Base";
import { Alert } from "@/ui/components/Feedback";
import {
    ProgressSteps,
    ProgressBar,
} from "@/ui/components/Navigation/Progress";
import { theme } from "@/ui/theme";
import {
    getStepByKey,
    useTunnelNavigation,
    useTunnelSubmission,
    type TunnelStepKey,
} from "@/core/tunnel";

const Header = styled.section`
    padding-top: ${theme.spacing[8]};
    padding-bottom: ${theme.spacing[6]};

    @media (max-width: ${theme.breakpoints.sm}) {
        padding-top: ${theme.spacing[5]};
    }
`;

/**
 * Barre de navigation. Sur mobile, elle se colle en bas de l'écran pour rester
 * accessible au pouce, et les boutons occupent toute la largeur.
 */
const NavBar = styled.div`
    padding-top: ${theme.spacing[4]};

    @media (max-width: ${theme.breakpoints.sm}) {
        position: sticky;
        bottom: 0;
        padding: ${theme.spacing[3]} 0;
        background-color: ${theme.colors.background.surface};
        border-top: 1px solid ${theme.colors.border.default};
    }
`;

const NavButtons = styled(Flex)`
    @media (max-width: ${theme.breakpoints.sm}) {
        flex-direction: column-reverse;

        & > button {
            width: 100%;
        }
    }
`;

/** Sous-titres commerciaux affichés sous le titre de chaque étape. */
const STEP_SUBTITLES: Record<TunnelStepKey, string> = {
    projet_type:
        "Réalisez jusqu'à 500 € d'économies par an sur vos mensualités.",
    projet_montant: "Ajustez le montant et la durée qui vous conviennent.",
    situation_familiale:
        "Ces informations nous aident à personnaliser votre offre.",
    situation_logement: "Votre logement complète l'étude de votre demande.",
    pro_emprunteur:
        "Votre situation professionnelle affine votre capacité d'emprunt.",
    pro_coemprunteur:
        "La situation professionnelle du co-emprunteur est prise en compte.",
    revenus: "Un budget clair pour une proposition adaptée à vos moyens.",
    charges: "Vos charges nous permettent d'évaluer votre reste à vivre.",
    civilite: "Faisons connaissance : votre identité.",
    nationalite: "Quelques informations sur votre naissance.",
    contact_emprunteur: "Comment vous joindre et finaliser votre demande.",
    contact_coemprunteur: "Les coordonnées de votre co-emprunteur.",
};

export interface StepShellProps {
    /** Champs de l'étape courante. */
    children: React.ReactNode;
}

export const StepShell: React.FC<StepShellProps> = ({ children }) => {
    const {
        currentStep,
        currentStepKey,
        totalVisibleSteps,
        progressPercent,
        sections,
        isFirstStep,
        isLastStep,
        goNext,
        goPrevious,
    } = useTunnelNavigation();
    const { submit, isSubmitting, errorMessage } = useTunnelSubmission();

    const step = getStepByKey(currentStepKey);

    const handleNext = useCallback(async () => {
        // `goNext()` valide l'étape courante ; il bloque si elle est invalide.
        const advanced = goNext();
        if (advanced && isLastStep) {
            await submit();
        }
    }, [goNext, isLastStep, submit]);

    return (
        <Container size="md">
            <Header>
                <Stack gap={5}>
                    {/* Stepper = SECTIONS (grossier). */}
                    <ProgressSteps sections={sections} />
                    {/* Barre = ÉTAPES (fin) : avance à chaque étape. */}
                    <ProgressBar
                        value={progressPercent}
                        label={`Étape ${currentStep} sur ${totalVisibleSteps}`}
                    />
                </Stack>
            </Header>

            <Card variant="elevated">
                <Card.Body>
                    <Stack gap={6}>
                        <Stack gap={2}>
                            <Title as="h1" level={3}>
                                {step.label}
                            </Title>
                            <Text as="p" tone="secondary">
                                {STEP_SUBTITLES[currentStepKey]}
                            </Text>
                        </Stack>

                        {errorMessage && (
                            <Alert type="danger" title="Envoi impossible">
                                {errorMessage}
                            </Alert>
                        )}

                        {children}

                        <NavBar>
                            <NavButtons
                                align="center"
                                justify={
                                    isFirstStep ? "flex-end" : "space-between"
                                }
                                gap={3}
                            >
                                {!isFirstStep && (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        type="button"
                                        onClick={goPrevious}
                                        disabled={isSubmitting}
                                    >
                                        Précédent
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    size="lg"
                                    type="button"
                                    onClick={handleNext}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isLastStep
                                        ? "Valider ma demande"
                                        : "Suivant"}
                                </Button>
                            </NavButtons>
                        </NavBar>
                    </Stack>
                </Card.Body>
            </Card>
        </Container>
    );
};

StepShell.displayName = "StepShell";

export default StepShell;
