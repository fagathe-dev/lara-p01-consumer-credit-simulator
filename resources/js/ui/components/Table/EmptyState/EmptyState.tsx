/**
 * EmptyState Component
 * Placeholder shown when a table (or any collection) has no data.
 * Can be rendered standalone or inside a full-width table cell.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[12]} ${theme.spacing[6]};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

const IconSlot = styled.div`
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize['4xl']};
  line-height: 1;
`;

const Title = styled.p`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  max-width: 42ch;
`;

const ActionSlot = styled.div`
  margin-top: ${theme.spacing[2]};
`;

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Optional call to action (e.g. a Button). */
  action?: React.ReactNode;
}

/**
 * EmptyState Component
 * @example
 * <EmptyState title="Aucun dossier" description="Créez votre premier dossier." action={<Button>Nouveau</Button>} />
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, ...props }, ref) => (
    <Wrapper ref={ref} {...props}>
      {icon && <IconSlot aria-hidden="true">{icon}</IconSlot>}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && <ActionSlot>{action}</ActionSlot>}
    </Wrapper>
  ),
);

EmptyState.displayName = 'EmptyState';
