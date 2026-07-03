/**
 * Link Component
 * Anchor styled with the brand link color, optional underline and external safety.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type LinkVariant = "default" | "muted" | "onPrimary";

const variantColor: Record<LinkVariant, string> = {
    default: theme.colors.text.link,
    muted: theme.colors.text.secondary,
    onPrimary: theme.colors.text.onPrimary,
};

const StyledLink = styled.a<{ $variant: LinkVariant; $underline: boolean }>`
    color: ${(props) => variantColor[props.$variant]};
    font-family: ${theme.typography.fontFamily.base};
    font-weight: ${theme.typography.fontWeight.medium};
    text-decoration: ${(props) => (props.$underline ? "underline" : "none")};
    cursor: pointer;
    transition: color 150ms ease;

    &:hover {
        color: ${theme.colors.brand.primaryHover};
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
        border-radius: ${theme.radius.sm};
    }
`;

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: LinkVariant;
    underline?: boolean;
    /** When true, adds rel="noopener noreferrer" and target="_blank". */
    external?: boolean;
}

/**
 * Link Component
 * @example
 * <Link href="/mentions-legales">Mentions légales</Link>
 * <Link href="https://example.com" external>Site externe</Link>
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    (
        { variant = "default", underline = false, external = false, ...props },
        ref,
    ) => (
        <StyledLink
            ref={ref}
            $variant={variant}
            $underline={underline}
            target={external ? "_blank" : props.target}
            rel={external ? "noopener noreferrer" : props.rel}
            {...props}
        />
    ),
);

Link.displayName = "Link";
