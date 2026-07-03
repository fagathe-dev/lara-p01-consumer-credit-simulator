/**
 * Divider Component
 * Simple horizontal or vertical line separator
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type DividerOrientation = "horizontal" | "vertical";

const StyledDivider = styled.div<{ $orientation: DividerOrientation }>`
    background-color: ${theme.colors.border.default};

    ${(props) =>
        props.$orientation === "vertical"
            ? `
        width: 1px;
        height: 100%;
      `
            : `
        width: 100%;
        height: 1px;
      `}
`;

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: DividerOrientation;
}

/**
 * Divider Component
 * @example
 * <Divider /> // Horizontal
 * <Divider orientation="vertical" /> // Vertical
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ orientation = "horizontal", ...props }, ref) => (
        <StyledDivider ref={ref} $orientation={orientation} {...props} />
    ),
);

Divider.displayName = "Divider";
