import React from "react";
import styled from "styled-components";
import { Container, Stack } from "@/ui/components/Layout";
import { Title, Text } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import { Seo } from "@/components/Seo";
import { PublicLayout } from "@/components/Layouts";
import { TunnelCTA } from "@/components/TunnelCTA";
import type { PageProps } from "@/types/seo";

const Wrapper = styled.section`
    padding-top: ${theme.spacing[10]};
    padding-bottom: ${theme.spacing[10]};
`;

/** Legal text: long-form paragraphs use the relaxed line-height token. */
const LegalParagraph = styled(Text)`
    line-height: ${theme.typography.lineHeight.relaxed};
`;

const MentionsLegales: React.FC<PageProps> = ({ seo }) => (
    <PublicLayout stickyCtaLabel="Simuler mon crédit">
        <Seo seo={seo} />
        <Container size="md">
            <Wrapper>
                <Stack gap={8}>
                    <Title as="h1" level={1}>
                        Mentions légales & informations réglementaires
                    </Title>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Éditeur du site
                        </Title>
                        <LegalParagraph as="p" tone="secondary">
                            Le présent site est édité par CréditSimul SAS, au
                            capital de 100 000 €, immatriculée au RCS sous le
                            numéro 000 000 000, dont le siège social est situé 1
                            rue de la Finance, 75000 Paris. Intermédiaire en
                            opérations de banque et en services de paiement
                            (IOBSP) immatriculé à l'ORIAS.
                        </LegalParagraph>
                    </Stack>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Hébergeur
                        </Title>
                        <LegalParagraph as="p" tone="secondary">
                            Le site est hébergé par un prestataire assurant le
                            stockage et la disponibilité des données au sein de
                            l'Union européenne.
                        </LegalParagraph>
                    </Stack>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Taux et coût du crédit
                        </Title>
                        <LegalParagraph as="p" tone="secondary">
                            Les offres de crédit sont proposées à un TAEG fixe.
                            Le Taux Annuel Effectif Global inclut l'ensemble des
                            frais liés à l'octroi du crédit. Le montant total dû
                            et le coût total du crédit vous sont communiqués
                            avant toute souscription.
                        </LegalParagraph>
                    </Stack>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Mention réglementaire
                        </Title>
                        <LegalParagraph as="p" tone="primary" weight="semibold">
                            Un crédit vous engage et doit être remboursé.
                            Vérifiez vos capacités de remboursement avant de
                            vous engager.
                        </LegalParagraph>
                    </Stack>

                    <Stack gap={3}>
                        <Title as="h2" level={4}>
                            Politique de confidentialité (RGPD)
                        </Title>
                        <LegalParagraph as="p" tone="secondary">
                            <strong>Finalités :</strong> les données collectées
                            via le simulateur et le tunnel de demande sont
                            traitées pour l'étude de votre demande de crédit, la
                            gestion de la relation client et le respect des
                            obligations légales.
                        </LegalParagraph>
                        <LegalParagraph as="p" tone="secondary">
                            <strong>Base légale :</strong> l'exécution de
                            mesures précontractuelles prises à votre demande et
                            le respect des obligations légales auxquelles est
                            soumis l'établissement.
                        </LegalParagraph>
                        <LegalParagraph as="p" tone="secondary">
                            <strong>Durée de conservation :</strong> vos données
                            sont conservées pendant la durée nécessaire à
                            l'étude de la demande puis archivées conformément
                            aux durées légales applicables au secteur financier.
                        </LegalParagraph>
                        <LegalParagraph as="p" tone="secondary">
                            <strong>Vos droits :</strong> vous disposez d'un
                            droit d'accès, de rectification, d'effacement, de
                            limitation et d'opposition sur vos données. Vous
                            pouvez les exercer en contactant notre délégué à la
                            protection des données.
                        </LegalParagraph>
                    </Stack>

                    <TunnelCTA
                        variant="inline"
                        label="Estimer ma mensualité en ligne"
                    />
                </Stack>
            </Wrapper>
        </Container>
    </PublicLayout>
);

export default MentionsLegales;
