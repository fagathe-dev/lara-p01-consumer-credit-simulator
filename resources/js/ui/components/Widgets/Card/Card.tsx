/**
 * Card Component
 * Variants: default, bordered, elevated
 * With optional Header, Body, Footer sub-components
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type CardVariant = "default" | "bordered" | "elevated";

interface CardContainerProps {
    $variant: CardVariant;
}

const CardContainer = styled.div<CardContainerProps>`
    border-radius: ${theme.radius.lg};
    background-color: ${theme.colors.background.surface};

    ${(props) => {
        switch (props.$variant) {
            case "bordered":
                return `border: 1px solid ${theme.colors.border.default};`;
            case "elevated":
                return `box-shadow: ${theme.shadows.md};`;
            case "default":
            default:
                return `border: 1px solid ${theme.colors.border.default};`;
        }
    }}
`;

const CardHeader = styled.div`
    padding: ${theme.spacing[6]};
    border-bottom: 1px solid ${theme.colors.border.default};
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${theme.typography.fontSize.lg};
    color: ${theme.colors.text.primary};
`;

const CardBody = styled.div`
    padding: ${theme.spacing[6]};
`;

const CardFooter = styled.div`
    padding: ${theme.spacing[6]};
    border-top: 1px solid ${theme.colors.border.default};
    display: flex;
    gap: ${theme.spacing[3]};
    justify-content: flex-end;
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
}

/**
 * Card.Root - Main container
 */
const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
    ({ variant = "default", ...props }, ref) => (
        <CardContainer ref={ref} $variant={variant} {...props} />
    ),
);
CardRoot.displayName = "Card";

/**
 * Card Component with sub-components
 * @example
 * <Card variant="elevated">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Actions</Card.Footer>
 * </Card>
 */
export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
});
