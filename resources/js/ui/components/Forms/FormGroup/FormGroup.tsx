/**
 * FormGroup Component
 * Groups related fields under an optional legend, rendered as a fieldset.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledFieldset = styled.fieldset`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0;
`;

const Legend = styled.legend`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    padding: 0;
    margin-bottom: ${theme.spacing[1]};
`;

const Description = styled.p`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0 0 ${theme.spacing[2]};
`;

export interface FormGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
    /** Group title rendered as a <legend>. */
    legend?: string;
    /** Optional descriptive text below the legend. */
    description?: string;
}

/**
 * FormGroup Component
 * @example
 * <FormGroup legend="Coordonnées" description="Renseignez vos informations de contact">
 *   <Field label="Nom">...</Field>
 *   <Field label="Prénom">...</Field>
 * </FormGroup>
 */
export const FormGroup = React.forwardRef<HTMLFieldSetElement, FormGroupProps>(
    ({ legend, description, children, ...props }, ref) => (
        <StyledFieldset ref={ref} {...props}>
            {legend && <Legend>{legend}</Legend>}
            {description && <Description>{description}</Description>}
            {children}
        </StyledFieldset>
    ),
);

FormGroup.displayName = "FormGroup";
