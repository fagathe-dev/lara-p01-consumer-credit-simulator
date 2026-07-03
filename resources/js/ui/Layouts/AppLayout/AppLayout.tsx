/**
 * AppLayout Component
 * Used for public site and tunnel pages
 * Header + content area + footer, no sidebar
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';
import { Container } from '@/ui/components/Layout';

const AppLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background.app};
`;

const AppLayoutHeader = styled.header`
  background-color: ${theme.colors.background.surface};
  border-bottom: 1px solid ${theme.colors.border.default};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const AppLayoutContent = styled.main`
  flex: 1;
  width: 100%;
  padding-top: ${theme.spacing[6]};
  padding-bottom: ${theme.spacing[6]};
`;

const AppLayoutFooter = styled.footer`
  background-color: ${theme.colors.background.inverse};
  color: white;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.default};
  margin-top: auto;
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

export interface AppLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AppLayout Component
 * @example
 * <AppLayout header={<Header />} footer={<Footer />}>
 *   <TunnelPage />
 * </AppLayout>
 */
export const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ header, footer, children }, ref) => (
    <AppLayoutContainer ref={ref}>
      {header && <AppLayoutHeader>{header}</AppLayoutHeader>}
      <AppLayoutContent>
        <Container size="xl">{children}</Container>
      </AppLayoutContent>
      {footer && <AppLayoutFooter>{footer}</AppLayoutFooter>}
    </AppLayoutContainer>
  ),
);

AppLayout.displayName = 'AppLayout';
