import React from "react";
import styled from "styled-components";
import { Container, Grid, Stack } from "@/ui/components/Layout";
import { Card } from "@/ui/components/Widgets";
import { Alert } from "@/ui/components/Feedback";
import { Title, Text } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import { Seo } from "@/components/Seo";
import { TunnelLayout } from "@/components/Layouts";
import { TunnelCTA } from "@/components/TunnelCTA";
import type { PageProps } from "@/types/seo";

const Wrapper = styled.section`
    padding-top: ${theme.spacing[10]};
    padding-bottom: ${theme.spacing[10]};
`;

const Amount = styled(Text)`
    font-size: ${theme.typography.fontSize["2xl"]};
`;

/** One commercial offer computed by Laravel (from the Python scoring API). */
export interface Offer {
    key: "courte" | "equilibree" | "souple";
    label: string;
    monthlyPayment: number;
    duration: number;
    taeg: number;
    totalCost: number;
}

interface ResultatProps extends PageProps {
    /** Customer reference / dossier number. */
    reference: string;
    /** Available offers, or null while the dossier is still under study. */
    offers: readonly Offer[] | null;
}

const euro = (value: number): string =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(value);

const Resultat: React.FC<ResultatProps> = ({ seo, reference, offers }) => (
    <TunnelLayout>
        <Seo seo={seo} />
        <Container size="md">
            <Wrapper>
                <Stack gap={8}>
                    <Stack gap={4}>
                        <Alert type="success" title="Demande bien reçue">
                            Votre demande de crédit a été enregistrée sous la
                            référence {reference}.
                        </Alert>
                        <Title as="h1" level={2}>
                            Merci, votre dossier est entre de bonnes mains
                        </Title>
                        <Text as="p" size="lg" tone="secondary">
                            Nos équipes étudient votre demande et vous
                            communiquent une réponse de principe sous 24 heures
                            ouvrées.
                        </Text>
                    </Stack>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Les prochaines étapes
                        </Title>
                        <Text as="p" tone="secondary">
                            1. Étude de votre dossier par un conseiller. 2.
                            Réponse de principe communiquée par e-mail. 3.
                            Finalisation et signature de votre offre en cas
                            d'accord.
                        </Text>
                    </Stack>

                    {offers && offers.length > 0 ? (
                        <Stack gap={6}>
                            <Title as="h2" level={4}>
                                Vos propositions personnalisées
                            </Title>
                            <Grid columns={3} gap={6}>
                                {offers.map((offer) => (
                                    <Card key={offer.key} variant="elevated">
                                        <Card.Header>{offer.label}</Card.Header>
                                        <Card.Body>
                                            <Stack gap={3}>
                                                <Stack gap={1}>
                                                    <Text
                                                        as="span"
                                                        size="sm"
                                                        tone="secondary"
                                                    >
                                                        Mensualité
                                                    </Text>
                                                    <Amount
                                                        as="span"
                                                        weight="bold"
                                                        tabular
                                                    >
                                                        {euro(
                                                            offer.monthlyPayment,
                                                        )}
                                                    </Amount>
                                                </Stack>
                                                <Text
                                                    as="p"
                                                    size="sm"
                                                    tone="secondary"
                                                >
                                                    Durée : {offer.duration}{" "}
                                                    mois · TAEG {offer.taeg}%
                                                </Text>
                                                <Text
                                                    as="p"
                                                    size="sm"
                                                    tone="secondary"
                                                >
                                                    Coût total :{" "}
                                                    {euro(offer.totalCost)}
                                                </Text>
                                            </Stack>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Grid>
                        </Stack>
                    ) : (
                        <Alert type="info" title="Dossier en cours d'étude">
                            Vos propositions personnalisées seront disponibles
                            dès la fin de l'analyse de votre dossier.
                        </Alert>
                    )}

                    <TunnelCTA
                        variant="inline"
                        label="Faire une nouvelle simulation"
                    />
                </Stack>
            </Wrapper>
        </Container>
    </TunnelLayout>
);

export default Resultat;
