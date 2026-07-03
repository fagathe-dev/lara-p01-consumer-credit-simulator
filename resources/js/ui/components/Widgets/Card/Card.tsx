/**
 * Card Component
 * Variants: default, bordered, elevated
 * With optional Header, Body, Footer sub-components
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export type CardVariant = 'default' | 'bordered' | 'elevated';
export type CardThemeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | null;

interface CardContainerProps {
  $variant: CardVariant;
  $themeVariant?: CardThemeVariant;
}

const CardContainer = styled.div<CardContainerProps>`
  border-radius: ${theme.radius.lg};
  background-color: ${theme.colors.background.surface};
  ${(props) => {
    switch (props.$themeVariant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger[100]};
          color: ${theme.colors.danger[800]};
        `;
      case null:
      default:
        return ``;
    }
  }}

  ${(props) => {
    switch (props.$variant) {
      case 'bordered':
        return `border: 1px solid ${theme.colors.border.default};`;
      case 'elevated':
        return `box-shadow: ${theme.shadows.md};`;
      case 'default':
      default:
        return `border: 1px solid ${theme.colors.border.default};`;
    }
  }}

    ${({ $themeVariant }) =>
    $themeVariant !== null &&
    `
        border: none;
        box-shadow: ${theme.shadows.sm};
    `}
`;

const CardHeader = styled.div`
  padding: ${theme.spacing[6]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
`;

const CardBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const CardFooter = styled.div`
  padding: ${theme.spacing[6]};
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  themeVariant?: CardThemeVariant;
}

/**
 * Card.Root - Main container
 */
const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', themeVariant = null, ...props }, ref) => (
    <CardContainer
      ref={ref}
      $variant={variant}
      $themeVariant={themeVariant}
      {...props}
    />
  ),
);
CardRoot.displayName = 'Card';

/**
 * Card Component with sub-components
 * @example
 * <Card variant="elevated">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Actions</Card.Footer>
 * </Card>
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
