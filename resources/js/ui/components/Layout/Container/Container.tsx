/**
 * Container Component
 * Centered, max-width content wrapper with horizontal padding.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const maxWidthMap: Record<ContainerSize, string> = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
};

const StyledContainer = styled.div<{ $size: ContainerSize }>`
    width: 100%;
    max-width: ${(props) => maxWidthMap[props.$size]};
    margin-left: auto;
    margin-right: auto;
    padding-left: ${theme.spacing[4]};
    padding-right: ${theme.spacing[4]};
`;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: ContainerSize;
}

/**
 * Container Component
 * @example
 * <Container size="lg">...</Container>
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ size = "lg", ...props }, ref) => (
        <StyledContainer ref={ref} $size={size} {...props} />
    ),
);

Container.displayName = "Container";
