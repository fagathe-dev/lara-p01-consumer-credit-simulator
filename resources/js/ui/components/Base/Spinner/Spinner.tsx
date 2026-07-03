/**
 * Spinner Component
 * Lightweight indeterminate loading indicator (rotating ring).
 */

import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "@/ui/theme";

export type SpinnerSize = "sm" | "md" | "lg" | number;

const sizeMap: Record<Exclude<SpinnerSize, number>, string> = {
    sm: "16px",
    md: "24px",
    lg: "40px",
};

const resolveSize = (size: SpinnerSize): string =>
    typeof size === "number" ? `${size}px` : sizeMap[size];

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const StyledSpinner = styled.span<{ $size: SpinnerSize; $color: string }>`
    display: inline-block;
    flex-shrink: 0;
    width: ${(props) => resolveSize(props.$size)};
    height: ${(props) => resolveSize(props.$size)};
    border: 2px solid ${theme.colors.slate[200]};
    border-top-color: ${(props) => props.$color};
    border-radius: ${theme.radius.full};
    animation: ${spin} 600ms linear infinite;
`;

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: SpinnerSize;
    /** Color of the spinning arc (defaults to brand primary). */
    color?: string;
    /** Accessible label announced to assistive tech. */
    label?: string;
}

/**
 * Spinner Component
 * @example
 * <Spinner size="md" />
 * <Spinner size={48} label="Chargement des dossiers" />
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
    (
        {
            size = "md",
            color = theme.colors.brand.primary,
            label = "Chargement",
            ...props
        },
        ref,
    ) => (
        <StyledSpinner
            ref={ref}
            $size={size}
            $color={color}
            role="status"
            aria-live="polite"
            aria-label={label}
            {...props}
        />
    ),
);

Spinner.displayName = "Spinner";
