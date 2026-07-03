/**
 * MoneyInput Component
 * Specialized input for financial amounts with tabular figures
 * Formats display as currency but stores numeric value
 */

import React, { useState, useCallback } from "react";
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

const StyledMoneyInput = styled.input<{ $hasError?: boolean }>`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.base};
    font-family: ${theme.typography.fontFamily.tabular};
    font-variant-numeric: tabular-nums;
    border: 1px solid
        ${(props) =>
            props.$hasError
                ? theme.colors.danger[500]
                : theme.colors.border.default};
    border-radius: ${theme.radius.md};
    background-color: ${theme.colors.background.surface};
    color: ${theme.colors.text.primary};
    transition: all 150ms ease;
    text-align: right;

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
`;

export interface MoneyInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
> {
    label?: string;
    error?: string;
    currency?: string; // Display only (e.g., "€", "$")
    showCurrency?: boolean;
}

/**
 * MoneyInput Component
 * Accepts numeric values, formats display
 * @example
 * <MoneyInput label="Monthly Payment" currency="€" value={1500} onChange={handleChange} />
 */
export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ label, error, currency = "€", showCurrency = true, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState(
            props.value ? formatCurrency(Number(props.value)) : "",
        );

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = e.target.value.replace(/[^\d.,-]/g, "");
                const numericValue =
                    parseFloat(inputValue.replace(/[.,]/g, ".")) || 0;

                setDisplayValue(formatCurrency(numericValue));

                // Call original onChange with numeric value
                if (props.onChange) {
                    const syntheticEvent = {
                        ...e,
                        target: {
                            ...e.target,
                            value: String(numericValue),
                        },
                    };
                    props.onChange(
                        syntheticEvent as React.ChangeEvent<HTMLInputElement>,
                    );
                }
            },
            [props],
        );

        return (
            <InputWrapper>
                {label && <InputLabel htmlFor={props.id}>{label}</InputLabel>}
                <StyledMoneyInput
                    ref={ref}
                    type="text"
                    inputMode="decimal"
                    $hasError={!!error}
                    value={displayValue}
                    onChange={handleChange}
                    {...props}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputWrapper>
        );
    },
);

MoneyInput.displayName = "MoneyInput";

/**
 * Format number as currency
 * @param value Numeric value
 * @param locale Language locale for formatting
 * @returns Formatted string (e.g., "1 500,00" for fr-FR)
 */
function formatCurrency(value: number, locale = "fr-FR"): string {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
