/**
 * Field Component
 * Wrapper wiring a label, control, optional hint and error message together
 * with the proper accessibility attributes (aria-describedby / htmlFor).
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[1]};
`;

const FieldHint = styled.span`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Id shared by the label (htmlFor) and the control. */
    htmlFor?: string;
    label?: string;
    required?: boolean;
    /** Helper text shown below the control when there is no error. */
    hint?: string;
    /** Validation error; when present it replaces the hint. */
    error?: string;
    /** The form control (Input, Select, etc.). */
    children: React.ReactNode;
}

/**
 * Field Component
 * @example
 * <Field htmlFor="email" label="Email" required error={errors.email}>
 *   <Input id="email" type="email" aria-describedby="email-error" />
 * </Field>
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    (
        { htmlFor, label, required = false, hint, error, children, ...props },
        ref,
    ) => {
        const describedById = htmlFor
            ? error
                ? `${htmlFor}-error`
                : hint
                  ? `${htmlFor}-hint`
                  : undefined
            : undefined;

        return (
            <FieldWrapper ref={ref} {...props}>
                {label && (
                    <FieldLabel htmlFor={htmlFor} required={required}>
                        {label}
                    </FieldLabel>
                )}
                {children}
                {error ? (
                    <FieldError id={describedById}>{error}</FieldError>
                ) : hint ? (
                    <FieldHint id={describedById}>{hint}</FieldHint>
                ) : null}
            </FieldWrapper>
        );
    },
);

Field.displayName = "Field";
