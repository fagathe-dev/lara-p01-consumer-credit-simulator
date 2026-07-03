/**
 * AuthLayout Component
 * Used for login page and authentication screens
 * Centered card on light background, no navigation
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';
import { Stack, Flex } from '@/ui/components/Layout';

const AuthLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${theme.colors.background.app};
  padding: ${theme.spacing[4]};
`;

const AuthLayoutContent = styled.div`
  width: 100%;
  max-width: 420px;
`;

export interface AuthLayoutProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
}

/**
 * AuthLayout Component
 * @example
 * <AuthLayout logo={<Logo />}>
 *   <LoginForm />
 * </AuthLayout>
 */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ children, logo }, ref) => (
    <AuthLayoutContainer ref={ref}>
      <AuthLayoutContent>
        <Stack gap={6}>
          {logo && <Flex justify="center">{logo}</Flex>}
          {children}
        </Stack>
      </AuthLayoutContent>
    </AuthLayoutContainer>
  ),
);

AuthLayout.displayName = 'AuthLayout';
