/**
 * Label Component
 * Standalone form label with optional required marker.
 * (Distinct from Forms/FieldLabel which is wired into the Field wrapper.)
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const StyledLabel = styled.label`
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

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Displays a red asterisk after the label text. */
  required?: boolean;
}

/**
 * Label Component
 * @example
 * <Label htmlFor="email" required>Email</Label>
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, children, ...props }, ref) => (
    <StyledLabel ref={ref} {...props}>
      {children}
      {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
    </StyledLabel>
  ),
);

Label.displayName = 'Label';
