import React from "react";
import styled from "styled-components";
import { Link } from "@inertiajs/react";
import { Container, Grid, Stack } from "@/ui/components/Layout";
import { Card } from "@/ui/components/Widgets";
import { Accordion } from "@/ui/components/Widgets";
import { Title, Text } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import { Seo } from "@/components/Seo";
import { PublicLayout } from "@/components/Layouts";
import { TunnelCTA } from "@/components/TunnelCTA";
import { Reassurance } from "@/components/Reassurance";
import { products } from "@/core/products";
import type { PageProps } from "@/types/seo";

const Hero = styled.section`
    padding-top: ${theme.spacing[12]};
    padding-bottom: ${theme.spacing[8]};
`;

const Section = styled.section`
    margin-top: ${theme.spacing[12]};
    margin-bottom: ${theme.spacing[12]};
`;

const ProductLink = styled(Link)`
    text-decoration: none;
    display: block;
`;

const faqItems = [
    {
        id: "delai",
        title: "En combien de temps ai-je une réponse ?",
        content: (
            <Text as="p" tone="secondary">
                Une réponse de principe est étudiée sous 24 heures ouvrées après
                la soumission de votre demande.
            </Text>
        ),
    },
    {
        id: "gratuit",
        title: "La simulation est-elle gratuite et sans engagement ?",
        content: (
            <Text as="p" tone="secondary">
                Oui, la simulation est entièrement gratuite et ne vous engage à
                rien tant que vous n'avez pas signé d'offre de crédit.
            </Text>
        ),
    },
    {
        id: "documents",
        title: "Quels documents dois-je préparer ?",
        content: (
            <Text as="p" tone="secondary">
                Une pièce d'identité, un justificatif de domicile et vos
                derniers justificatifs de revenus suffisent pour démarrer.
            </Text>
        ),
    },
    {
        id: "securite",
        title: "Mes données sont-elles protégées ?",
        content: (
            <Text as="p" tone="secondary">
                Vos données sont chiffrées et traitées conformément au RGPD,
                uniquement pour l'étude de votre demande de crédit.
            </Text>
        ),
    },
];

const Home: React.FC<PageProps> = ({ seo }) => (
    <PublicLayout stickyCtaLabel="Simuler mon crédit en 2 minutes">
        <Seo seo={seo} />
        <Container size="lg">
            <Hero>
                <Stack gap={5}>
                    <Title as="h1" level={1}>
                        Votre crédit à la consommation, simulé en 2 minutes
                    </Title>
                    <Text as="p" size="lg" tone="secondary">
                        Estimez votre mensualité, comparez et déposez votre
                        demande en ligne. Réponse de principe sous 24h, en toute
                        sécurité.
                    </Text>
                    <TunnelCTA
                        variant="hero"
                        label="Simuler mon crédit en 2 minutes"
                    />
                </Stack>
            </Hero>

            <Section>
                <Stack gap={6}>
                    <Title as="h2" level={3}>
                        Une demande simple, rapide et sécurisée
                    </Title>
                    <Reassurance />
                </Stack>
            </Section>

            <Section>
                <Stack gap={6}>
                    <Title as="h2" level={3}>
                        Nos types de financement
                    </Title>
                    <Grid columns={3} gap={6}>
                        {products.map((product) => (
                            <ProductLink key={product.type} href={product.href}>
                                <Card variant="bordered">
                                    <Card.Body>
                                        <Stack gap={2}>
                                            <Title as="h3" level={5}>
                                                {product.label}
                                            </Title>
                                            <Text as="p" tone="secondary">
                                                {product.teaser}
                                            </Text>
                                        </Stack>
                                    </Card.Body>
                                </Card>
                            </ProductLink>
                        ))}
                    </Grid>
                </Stack>
            </Section>

            <Section>
                <Stack gap={6}>
                    <Title as="h2" level={3}>
                        Questions fréquentes
                    </Title>
                    <Accordion items={faqItems} />
                </Stack>
            </Section>

            <TunnelCTA variant="inline" label="Démarrer ma demande" />
        </Container>
    </PublicLayout>
);

export default Home;
