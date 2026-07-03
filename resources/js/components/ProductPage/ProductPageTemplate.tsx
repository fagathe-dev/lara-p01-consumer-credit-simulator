/**
 * ProductPageTemplate — shared structure for the five product pages (5–9).
 *
 * Layout: PublicLayout + <Seo /> (data from SeoService), H1, explanatory
 * block (typical amounts, durations, coverage), hero + inline TunnelCTA with
 * contextual labels, reused Reassurance block, and cross-links to the other
 * products (SEO maillage interne).
 */

import React from "react";
import styled from "styled-components";
import { Link } from "@inertiajs/react";
import { Container, Grid, Stack } from "@/ui/components/Layout";
import { Card } from "@/ui/components/Widgets";
import { Title, Text } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import { Seo } from "@/components/Seo";
import { PublicLayout } from "@/components/Layouts";
import { TunnelCTA } from "@/components/TunnelCTA";
import { Reassurance } from "@/components/Reassurance";
import { otherProducts, type ProjectType } from "@/core/products";
import type { SeoData } from "@/types/seo";

const Section = styled.section`
    margin-top: ${theme.spacing[10]};
    margin-bottom: ${theme.spacing[10]};
`;

const Hero = styled.section`
    padding-top: ${theme.spacing[10]};
    padding-bottom: ${theme.spacing[6]};
`;

const CrossLink = styled(Link)`
    color: ${theme.colors.text.link};
    font-weight: ${theme.typography.fontWeight.medium};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export interface ProductSpecific {
    title: string;
    description: string;
}

export interface ProductPageContent {
    type: ProjectType;
    h1: string;
    intro: string;
    specifics: readonly ProductSpecific[];
    heroCtaLabel: string;
    inlineCtaLabel: string;
    stickyCtaLabel: string;
}

export interface ProductPageTemplateProps {
    seo: SeoData;
    content: ProductPageContent;
}

export const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({
    seo,
    content,
}) => (
    <PublicLayout stickyCtaLabel={content.stickyCtaLabel}>
        <Seo seo={seo} />
        <Container size="lg">
            <Hero>
                <Stack gap={5}>
                    <Title as="h1" level={1}>
                        {content.h1}
                    </Title>
                    <Text as="p" size="lg" tone="secondary">
                        {content.intro}
                    </Text>
                    <TunnelCTA variant="hero" label={content.heroCtaLabel} />
                </Stack>
            </Hero>

            <Section>
                <Stack gap={6}>
                    <Title as="h2" level={3}>
                        Les spécificités de ce financement
                    </Title>
                    <Grid columns={3} gap={6}>
                        {content.specifics.map((item) => (
                            <Card key={item.title} variant="bordered">
                                <Card.Body>
                                    <Stack gap={2}>
                                        <Title as="h3" level={5}>
                                            {item.title}
                                        </Title>
                                        <Text as="p" tone="secondary">
                                            {item.description}
                                        </Text>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        ))}
                    </Grid>
                </Stack>
            </Section>

            <Section>
                <Stack gap={6}>
                    <Title as="h2" level={3}>
                        Pourquoi nous faire confiance
                    </Title>
                    <Reassurance />
                </Stack>
            </Section>

            <Section>
                <Stack gap={4}>
                    <Title as="h2" level={4}>
                        Un autre projet en tête ?
                    </Title>
                    <Stack gap={2}>
                        {otherProducts(content.type).map((product) => (
                            <CrossLink key={product.type} href={product.href}>
                                Vous cherchez plutôt un{" "}
                                {product.label.toLowerCase()} ? →
                            </CrossLink>
                        ))}
                    </Stack>
                </Stack>
            </Section>

            <TunnelCTA variant="inline" label={content.inlineCtaLabel} />
        </Container>
    </PublicLayout>
);

ProductPageTemplate.displayName = "ProductPageTemplate";
