/**
 * Badge Component
 * Supports status badges (linked to ApplicationStatusEnum) and custom tags with arbitrary colors
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type BadgeVariant = "status" | "custom";
export type StatusType = "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    status?: StatusType; // For variant="status"
    bgColor?: string; // For variant="custom"
    textColor?: string; // For variant="custom"
    borderColor?: string; // For variant="custom"
    size?: "sm" | "md";
}

const StyledBadge = styled.span<{
    $variant: BadgeVariant;
    $status?: StatusType;
    $bgColor?: string;
    $textColor?: string;
    $borderColor?: string;
    $size: "sm" | "md";
}>`
    display: inline-flex;
    align-items: center;
    border-radius: ${theme.radius.full};
    font-weight: ${theme.typography.fontWeight.medium};
    white-space: nowrap;
    border: 1px solid;

    ${(props) => {
        if (props.$variant === "custom" && props.$bgColor) {
            return `
        background-color: ${props.$bgColor};
        color: ${props.$textColor || theme.colors.text.primary};
        border-color: ${props.$borderColor || props.$bgColor};
      `;
        }

        // Status variant
        const statusConfig = theme.colors.status[props.$status || "info"];
        return `
      background-color: ${statusConfig.bg};
      color: ${statusConfig.text};
      border-color: ${statusConfig.border};
    `;
    }}

    ${(props) =>
        props.$size === "sm"
            ? `
        padding: ${theme.spacing[1]} ${theme.spacing[2]};
        font-size: ${theme.typography.fontSize.xs};
      `
            : `
        padding: ${theme.spacing[1]} ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
      `}
`;

/**
 * Badge Component
 * @example
 * // Status badge (for ApplicationStatusEnum)
 * <Badge variant="status" status="success">Accepté</Badge>
 *
 * // Custom tag badge (for CRM tags)
 * <Badge variant="custom" bgColor="#E8D5F2" textColor="#5C3E67">Apple</Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            variant = "status",
            status = "info",
            bgColor,
            textColor,
            borderColor,
            size = "md",
            ...props
        },
        ref,
    ) => (
        <StyledBadge
            ref={ref}
            $variant={variant}
            $status={status}
            $bgColor={bgColor}
            $textColor={textColor}
            $borderColor={borderColor}
            $size={size}
            {...props}
        />
    ),
);

Badge.displayName = "Badge";
