/**
 * Icon Component
 * Sizing/coloring wrapper around an inline SVG (or glyph) passed as children.
 * No external icon library — consistent with the pure styled-components approach.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type IconSize = "sm" | "md" | "lg" | "xl" | number;

const sizeMap: Record<Exclude<IconSize, number>, string> = {
    sm: "16px",
    md: "20px",
    lg: "24px",
    xl: "32px",
};

const resolveSize = (size: IconSize): string =>
    typeof size === "number" ? `${size}px` : sizeMap[size];

const StyledIcon = styled.span<{ $size: IconSize; $color?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 0;
    width: ${(props) => resolveSize(props.$size)};
    height: ${(props) => resolveSize(props.$size)};
    color: ${(props) => props.$color ?? "currentColor"};

    & > svg {
        width: 100%;
        height: 100%;
        display: block;
        fill: currentColor;
    }
`;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Icon dimensions — token keyword or explicit pixel number. */
    size?: IconSize;
    /** Overrides the inherited color. */
    color?: string;
    /** Accessible label; when omitted the icon is treated as decorative. */
    label?: string;
}

/**
 * Icon Component
 * @example
 * <Icon size="md" label="Menu"><MenuSvg /></Icon>
 * <Icon size={40} color={theme.colors.brand.primary}><Logo /></Icon>
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    ({ size = "md", color, label, children, ...props }, ref) => (
        <StyledIcon
            ref={ref}
            $size={size}
            $color={color}
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            {...props}
        >
            {children}
        </StyledIcon>
    ),
);

Icon.displayName = "Icon";
