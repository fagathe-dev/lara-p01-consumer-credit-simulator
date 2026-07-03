/**
 * FieldLabel Component
 * Label paired with a form control inside a Field. Supports a required marker.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledFieldLabel = styled.label`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing[1]};
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
`;

const RequiredMark = styled.span`
    color: ${theme.colors.danger[500]};
`;

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

/**
 * FieldLabel Component
 * @example
 * <FieldLabel htmlFor="amount" required>Montant</FieldLabel>
 */
export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
    ({ required = false, children, ...props }, ref) => (
        <StyledFieldLabel ref={ref} {...props}>
            {children}
            {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
        </StyledFieldLabel>
    ),
);

FieldLabel.displayName = "FieldLabel";
