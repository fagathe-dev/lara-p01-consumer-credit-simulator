/**
 * FieldError Component
 * Inline validation message displayed under a form control.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledFieldError = styled.span`
    display: block;
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.danger[700]};
`;

export interface FieldErrorProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * FieldError Component
 * @example
 * <FieldError id="amount-error">Le montant est requis.</FieldError>
 */
export const FieldError = React.forwardRef<HTMLSpanElement, FieldErrorProps>(
    ({ children, ...props }, ref) =>
        children ? (
            <StyledFieldError ref={ref} role="alert" {...props}>
                {children}
            </StyledFieldError>
        ) : null,
);

FieldError.displayName = "FieldError";
