/**
 * ErrorLayout Component
 * Used for error pages (404, 500, 403).
 * Centered message on a light background, no navigation.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';
import { Title, Text } from '@/ui/components/Typography';
import { Flex } from '@/ui/components/Layout';

const ErrorLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${theme.colors.background.app};
  padding: ${theme.spacing[6]};
  text-align: center;
`;

const ErrorLayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[4]};
  max-width: 480px;
`;

const ErrorCode = styled.div`
  font-size: ${theme.typography.fontSize['5xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.brand.primary};
  line-height: ${theme.typography.lineHeight.tight};
`;

export interface ErrorLayoutProps {
  /** Error code displayed prominently (e.g. "404", "500"). */
  code?: React.ReactNode;
  /** Short error title. */
  title?: React.ReactNode;
  /** Optional longer description / body content. */
  children?: React.ReactNode;
  /** Optional actions (e.g. a "Retour à l'accueil" button). */
  actions?: React.ReactNode;
}

/**
 * ErrorLayout Component
 * @example
 * <ErrorLayout
 *   code="404"
 *   title="Page introuvable"
 *   actions={<Button>Retour à l'accueil</Button>}
 * >
 *   La page que vous recherchez n'existe pas ou a été déplacée.
 * </ErrorLayout>
 */
export const ErrorLayout = React.forwardRef<HTMLDivElement, ErrorLayoutProps>(
  ({ code, title, children, actions }, ref) => (
    <ErrorLayoutContainer ref={ref}>
      <ErrorLayoutContent>
        {code && <ErrorCode>{code}</ErrorCode>}
        {title && <Title level={2}>{title}</Title>}
        {children && (
          <Text as="p" tone="secondary">
            {children}
          </Text>
        )}
        {actions && (
          <Flex
            gap={3}
            justify="center"
            style={{ marginTop: theme.spacing[2] }}
          >
            {actions}
          </Flex>
        )}
      </ErrorLayoutContent>
    </ErrorLayoutContainer>
  ),
);

ErrorLayout.displayName = 'ErrorLayout';
