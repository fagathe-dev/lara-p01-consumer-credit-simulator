/**
 * Reassurance — shared trust block reused on the home page and product pages.
 * Highlights: regulated lender, data security, 24h response time.
 */

import React from "react";
import { Grid } from "@/ui/components/Layout";
import { Card } from "@/ui/components/Widgets";
import { Title, Text } from "@/ui/components/Typography";
import { Stack } from "@/ui/components/Layout";

interface ReassuranceItem {
    title: string;
    description: string;
}

const items: readonly ReassuranceItem[] = [
    {
        title: "Organisme agréé",
        description:
            "Intermédiaire en crédit à la consommation immatriculé, soumis à la réglementation en vigueur.",
    },
    {
        title: "Données sécurisées",
        description:
            "Vos informations sont chiffrées et traitées dans le strict respect du RGPD.",
    },
    {
        title: "Réponse sous 24h",
        description:
            "Une réponse de principe à votre demande est étudiée sous 24 heures ouvrées.",
    },
];

export const Reassurance: React.FC = () => (
    <Grid columns={3} gap={6}>
        {items.map((item) => (
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
);

Reassurance.displayName = "Reassurance";
