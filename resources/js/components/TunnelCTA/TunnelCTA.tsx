/**
 * TunnelCTA — business call-to-action toward the credit request tunnel.
 *
 * This is a DOMAIN component (it knows the tunnel URL, the product being sold),
 * so it lives outside the generic UI Kit. It is built on top of the UI Kit
 * `Button` (rendered as an Inertia `Link` for a real, crawlable <a href>),
 * it does not reimplement a button.
 *
 * Every public page uses it at least twice with a different `label` to vary the
 * internal anchor texts (SEO maillage interne).
 */

import React from "react";
import styled from "styled-components";
import { Link } from "@inertiajs/react";
import { Button } from "@/ui/components/Base";
import { theme } from "@/ui/theme";
import { routes } from "@/routes";

export type TunnelCTAVariant = "hero" | "inline" | "sticky" | "footer";

export interface TunnelCTAProps {
    /** Visual placement / emphasis of the CTA. */
    variant?: TunnelCTAVariant;
    /** Anchor text — vary it per placement for internal linking. */
    label: string;
    /** Destination, always inside the tunnel. */
    href?: string;
}

/** Wrapper for the sticky mobile banner (hidden on wider viewports). */
const StickyBar = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    background-color: ${theme.colors.background.surface};
    border-top: 1px solid ${theme.colors.border.default};
    box-shadow: ${theme.shadows.md};

    @media (min-width: 768px) {
        display: none;
    }
`;

const HeroWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const InlineWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: ${theme.spacing[8]};
    margin-bottom: ${theme.spacing[8]};
`;

const FooterWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

/**
 * TunnelCTA
 * @example
 * <TunnelCTA variant="hero" label="Simuler mon crédit en 2 minutes" />
 */
export const TunnelCTA: React.FC<TunnelCTAProps> = ({
    variant = "inline",
    label,
    href = routes.tunnel,
}) => {
    switch (variant) {
        case "hero":
            return (
                <HeroWrapper>
                    <Button as={Link} href={href} variant="primary" size="lg">
                        {label}
                    </Button>
                </HeroWrapper>
            );
        case "sticky":
            return (
                <StickyBar>
                    <Button
                        as={Link}
                        href={href}
                        variant="primary"
                        size="lg"
                        fullWidth
                    >
                        {label}
                    </Button>
                </StickyBar>
            );
        case "footer":
            return (
                <FooterWrapper>
                    <Button as={Link} href={href} variant="primary" size="md">
                        {label}
                    </Button>
                </FooterWrapper>
            );
        case "inline":
        default:
            return (
                <InlineWrapper>
                    <Button as={Link} href={href} variant="primary" size="lg">
                        {label}
                    </Button>
                </InlineWrapper>
            );
    }
};

TunnelCTA.displayName = "TunnelCTA";
