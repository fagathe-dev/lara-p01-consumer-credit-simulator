/**
 * Button Component
 * Primary, secondary, outline, ghost, danger variants with size options
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    /** Render as another element/component (e.g. an anchor or Inertia Link). */
    as?: React.ElementType;
    /** Destination when rendered as a link (`as` is a link element/component). */
    href?: string;
}

const StyledButton = styled.button<{
    $variant: ButtonVariant;
    $size: ButtonSize;
    $isLoading?: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing[2]};
    border: none;
    border-radius: ${theme.radius.md};
    font-family: ${theme.typography.fontFamily.base};
    font-weight: ${theme.typography.fontWeight.semibold};
    cursor: pointer;
    transition: all 150ms ease;
    white-space: nowrap;
    position: relative;

    /* Size variants */
    ${(props) => {
        switch (props.$size) {
            case "sm":
                return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `;
            case "lg":
                return `
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
        `;
            case "md":
            default:
                return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
        `;
        }
    }}

    /* Color variants */
  ${(props) => {
        switch (props.$variant) {
            case "primary":
                return `
          background-color: ${theme.colors.brand.primary};
          color: ${theme.colors.text.onPrimary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.brand.primaryHover};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.brand.primaryActive};
          }
        `;

            case "secondary":
                return `
          background-color: ${theme.colors.slate[200]};
          color: ${theme.colors.text.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.slate[300]};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.slate[400]};
          }
        `;

            case "outline":
                return `
          background-color: transparent;
          color: ${theme.colors.brand.primary};
          border: 1px solid ${theme.colors.border.default};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.brand.primarySubtle};
            border-color: ${theme.colors.border.strong};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.mauve[100]};
          }
        `;

            case "ghost":
                return `
          background-color: transparent;
          color: ${theme.colors.text.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.slate[100]};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.slate[200]};
          }
        `;

            case "danger":
                return `
          background-color: ${theme.colors.danger[500]};
          color: ${theme.colors.text.onPrimary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.danger[600]};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.danger[700]};
          }
        `;

            default:
                return "";
        }
    }}

  /* Disabled state */
  &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Loading state */
    ${(props) =>
        props.$isLoading
            ? `
    color: transparent;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 600ms linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
            : ""}
`;

/**
 * Button Component
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            fullWidth = false,
            ...props
        },
        ref,
    ) => (
        <StyledButton
            ref={ref}
            $variant={variant}
            $size={size}
            $isLoading={isLoading}
            style={{ width: fullWidth ? "100%" : undefined }}
            {...props}
        />
    ),
);

Button.displayName = "Button";
