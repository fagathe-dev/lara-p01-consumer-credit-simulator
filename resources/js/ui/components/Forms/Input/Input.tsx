/**
 * Input Component
 * Base input field with error, disabled, and readOnly states
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[1]};
`;

const InputLabel = styled.label`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.base};
    font-family: ${theme.typography.fontFamily.base};
    border: 1px solid
        ${(props) =>
            props.$hasError
                ? theme.colors.danger[500]
                : theme.colors.border.default};
    border-radius: ${theme.radius.md};
    background-color: ${theme.colors.background.surface};
    color: ${theme.colors.text.primary};
    transition: all 150ms ease;

    &:hover:not(:disabled):not(:read-only) {
        border-color: ${theme.colors.border.strong};
    }

    &:focus {
        outline: none;
        border-color: ${theme.colors.border.focus};
        box-shadow: 0 0 0 3px ${theme.colors.brand.primarySubtle};
    }

    &:disabled {
        background-color: ${theme.colors.slate[100]};
        color: ${theme.colors.text.muted};
        cursor: not-allowed;
        opacity: 0.6;
    }

    &:read-only {
        background-color: ${theme.colors.slate[50]};
        cursor: default;
    }

    &::placeholder {
        color: ${theme.colors.text.muted};
    }
`;

const ErrorMessage = styled.span`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.danger[700]};
    margin-top: ${theme.spacing[1]};
`;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

/**
 * Input Component
 * @example
 * <Input label="Email" type="email" error="Invalid email" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => (
        <InputWrapper>
            {label && <InputLabel htmlFor={props.id}>{label}</InputLabel>}
            <StyledInput ref={ref} $hasError={!!error} {...props} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputWrapper>
    ),
);

Input.displayName = "Input";
