/**
 * Text Component
 * Body / inline text with size, weight, color and truncation options.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextTone = "primary" | "secondary" | "muted" | "onPrimary";

const toneColor: Record<TextTone, string> = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    muted: theme.colors.text.muted,
    onPrimary: theme.colors.text.onPrimary,
};

const StyledText = styled.span<{
    $size: TextSize;
    $weight: TextWeight;
    $tone: TextTone;
    $truncate: boolean;
    $tabular: boolean;
}>`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${(props) => theme.typography.fontSize[props.$size]};
    font-weight: ${(props) => theme.typography.fontWeight[props.$weight]};
    color: ${(props) => toneColor[props.$tone]};
    line-height: ${theme.typography.lineHeight.normal};
    margin: 0;

    ${(props) =>
        props.$tabular
            ? `
        font-variant-numeric: tabular-nums;
        font-family: ${theme.typography.fontFamily.tabular};
      `
            : ""}

    ${(props) =>
        props.$truncate
            ? `
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `
            : ""}
`;

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    /** Rendered HTML element. */
    as?: React.ElementType;
    size?: TextSize;
    weight?: TextWeight;
    tone?: TextTone;
    /** Truncate with ellipsis on overflow. */
    truncate?: boolean;
    /** Use tabular figures (financial amounts). */
    tabular?: boolean;
}

/**
 * Text Component
 * @example
 * <Text as="p" tone="secondary">Description</Text>
 * <Text tabular weight="semibold">1 500,00 €</Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
    (
        {
            as = "span",
            size = "base",
            weight = "regular",
            tone = "primary",
            truncate = false,
            tabular = false,
            ...props
        },
        ref,
    ) => (
        <StyledText
            ref={ref as never}
            as={as}
            $size={size}
            $weight={weight}
            $tone={tone}
            $truncate={truncate}
            $tabular={tabular}
            {...props}
        />
    ),
);

Text.displayName = "Text";
