/**
 * TunnelLayout — lightweight layout for the tunnel (3) and result (4) pages.
 *
 * Composes the UI Kit `AppLayout` with a minimal header (brand only, no
 * distracting CTA) and NO outbound footer navigation, to keep the focus on
 * completing the funnel. The result page may still render its own "relaunch"
 * CTA inside the content area.
 */

import React from "react";
import styled from "styled-components";
import { AppLayout } from "@/ui/Layouts";
import { Flex } from "@/ui/components/Layout";
import { theme } from "@/ui/theme";
import logo from "@images/logo.webp";
import { Image } from "@/ui";

const Brand = styled.span`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.brand.primary};
`;

const SecurityNote = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
`;

const Header: React.FC = () => (
    <Flex align="center" justify="space-between" gap={4}>
        <Brand>
            <Image
                src={logo}
                alt="Logo simulateur de crédit consommation"
                width={32}
                height={32}
            />
        </Brand>
        <SecurityNote>Demande sécurisée · chiffrée</SecurityNote>
    </Flex>
);

export interface TunnelLayoutProps {
    children: React.ReactNode;
}

export const TunnelLayout: React.FC<TunnelLayoutProps> = ({ children }) => (
    <AppLayout header={<Header />}>{children}</AppLayout>
);

TunnelLayout.displayName = "TunnelLayout";
