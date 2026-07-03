/**
 * Select Component
 * Native HTML select with styled wrapper
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[1]};
`;

const SelectLabel = styled.label`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
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
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right ${theme.spacing[3]} center;
    padding-right: calc(${theme.spacing[3]} + 20px);

    &:hover:not(:disabled) {
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

    option {
        background-color: ${theme.colors.background.surface};
        color: ${theme.colors.text.primary};
    }
`;

const ErrorMessage = styled.span`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.danger[700]};
`;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: Array<{ value: string | number; label: string }>;
}

/**
 * Select Component
 * @example
 * <Select label="Status" options={[
 *   { value: 'pending', label: 'Pending' },
 *   { value: 'approved', label: 'Approved' },
 * ]} />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options = [], ...props }, ref) => (
        <SelectWrapper>
            {label && <SelectLabel htmlFor={props.id}>{label}</SelectLabel>}
            <StyledSelect ref={ref} $hasError={!!error} {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </SelectWrapper>
    ),
);

Select.displayName = "Select";
