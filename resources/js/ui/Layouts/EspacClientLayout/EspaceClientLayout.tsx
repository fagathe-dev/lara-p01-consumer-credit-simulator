/**
 * EspaceClientLayout Component
 * Layout de l'espace client : en-tête sobre avec marque + identité utilisateur,
 * zone de contenu centrée. Cohérent avec les tokens du design system.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';
import { Container, Flex } from '@/ui/components/Layout';
import { Avatar } from '@/ui/components/Media';
import { Text } from '@/ui/components/Typography';

const LayoutRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.subtle};
`;

const Header = styled.header`
  background-color: ${theme.colors.background.surface};
  border-bottom: 1px solid ${theme.colors.border.default};
  box-shadow: ${theme.shadows.sm};
`;

const HeaderInner = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
`;

const Brand = styled.span`
  font-family: ${theme.typography.fontFamily.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
`;

const Content = styled.main`
  flex: 1;
  padding-top: ${theme.spacing[8]};
  padding-bottom: ${theme.spacing[10]};
`;

export interface EspaceClientLayoutProps {
  children: React.ReactNode;
  /** Nom complet affiché dans l'en-tête. */
  userName?: string;
  /** URL de la photo de profil (fallback initiales via Avatar). */
  avatarUrl?: string | null;
  /** Actions à droite de l'en-tête (ex. bouton de déconnexion). */
  actions?: React.ReactNode;
}

/**
 * EspaceClientLayout Component
 * @example
 * <EspaceClientLayout userName="Marie Durand" actions={<Button>Déconnexion</Button>}>
 *   <Dashboard />
 * </EspaceClientLayout>
 */
export const EspaceClientLayout = React.forwardRef<
  HTMLDivElement,
  EspaceClientLayoutProps
>(({ children, userName, avatarUrl, actions }, ref) => (
  <LayoutRoot ref={ref}>
    <Header>
      <Container size="lg">
        <HeaderInner>
          <Brand>Espace client</Brand>
          <Flex align="center" gap={4}>
            {userName && (
              <Flex align="center" gap={2}>
                <Avatar
                  size="sm"
                  name={userName}
                  src={avatarUrl ?? undefined}
                  alt={userName}
                />
                <Text size="sm" weight="medium">
                  {userName}
                </Text>
              </Flex>
            )}
            {actions}
          </Flex>
        </HeaderInner>
      </Container>
    </Header>
    <Content>
      <Container size="lg">{children}</Container>
    </Content>
  </LayoutRoot>
));

EspaceClientLayout.displayName = 'EspaceClientLayout';
