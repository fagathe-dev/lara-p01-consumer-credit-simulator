/**
 * PublicLayout — application layout for public marketing pages (1, 2, 5–9).
 *
 * Composes the generic UI Kit `AppLayout` with:
 *  - a header (logo + desktop TunnelCTA)
 *  - a shared footer (links to home, product pages, legal notice + reminder)
 *  - a sticky mobile TunnelCTA banner (present on every public page)
 */

import React from "react";
import styled from "styled-components";
import { Link } from "@inertiajs/react";
import { AppLayout } from "@/ui/Layouts";
import { Flex, Stack } from "@/ui/components/Layout";
import { Text, Title } from "@/ui/components/Typography";
import { theme } from "@/ui/theme";
import { TunnelCTA } from "@/components/TunnelCTA";
import { routes } from "@/routes";
import { products } from "@/core/products";
import logo from "@images/logo.webp";
import { Button, Image } from "@/ui";

const BrandLink = styled(Link)`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.brand.primary};
    text-decoration: none;
`;

const FooterLink = styled(Link)`
    color: ${theme.colors.text.onPrimary};
    font-size: ${theme.typography.fontSize.sm};
    text-decoration: none;
    opacity: 0.85;
    transition: opacity 150ms ease;

    &:hover {
        opacity: 1;
        text-decoration: underline;
    }
`;

const FooterColumns = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing[8]};

    @media (max-width: 768px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

const FooterColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[2]};
`;

const FooterHeading = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.onPrimary};
    margin-bottom: ${theme.spacing[2]};
`;

const LegalReminder = styled.p`
    margin-top: ${theme.spacing[6]};
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.onPrimary};
    opacity: 0.7;
    line-height: ${theme.typography.lineHeight.relaxed};
`;

const Header: React.FC = () => (
    <Flex align="center" justify="space-between" gap={4}>
        <BrandLink href={routes.home}>
            <Image
                src={logo}
                alt="Logo simulateur de crédit consommation"
                width={32}
                height={32}
            />
        </BrandLink>
        <Button variant="primary" as={Link} href={routes.espaceClient.login}>
            Mon compte
        </Button>
    </Flex>
);

const Footer: React.FC = () => (
    <Stack gap={6}>
        <FooterColumns>
            <FooterColumn>
                <FooterHeading>Navigation</FooterHeading>
                <FooterLink href={routes.home}>Accueil</FooterLink>
                <FooterLink href={routes.tunnel}>Simuler mon crédit</FooterLink>
                <FooterLink href={routes.mentionsLegales}>
                    Mentions légales
                </FooterLink>
            </FooterColumn>
            <FooterColumn>
                <FooterHeading>Nos financements</FooterHeading>
                {products.map((product) => (
                    <FooterLink key={product.type} href={product.href}>
                        {product.label}
                    </FooterLink>
                ))}
            </FooterColumn>
            <FooterColumn>
                <FooterHeading>Un projet ?</FooterHeading>
                <Text as="p" tone="onPrimary" size="sm">
                    Estimez votre mensualité et déposez votre demande en
                    quelques minutes.
                </Text>
                <Button variant="primary" as={Link} href={routes.tunnel}>
                    Démarrer maintenant
                </Button>
            </FooterColumn>
        </FooterColumns>
        <LegalReminder>
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités
            de remboursement avant de vous engager.
        </LegalReminder>
    </Stack>
);

export interface PublicLayoutProps {
    children: React.ReactNode;
    /** Anchor text for the mobile sticky CTA (vary it per page). */
    stickyCtaLabel?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
    children,
    stickyCtaLabel = "Simuler mon crédit",
}) => (
    <>
        <AppLayout header={<Header />} footer={<Footer />}>
            {children}
        </AppLayout>
        <TunnelCTA variant="sticky" label={stickyCtaLabel} />
    </>
);

PublicLayout.displayName = "PublicLayout";
