/**
 * Menu Component
 * Vertical list of navigation/action items (sidebar or dropdown content).
 * Composed of Menu + Menu.Item; supports active and disabled states.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  list-style: none;
  margin: 0;
  padding: ${theme.spacing[1]};
`;

const StyledItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: none;
  border-radius: ${theme.radius.md};
  background-color: ${(props) =>
    props.$active ? theme.colors.brand.primarySubtle : 'transparent'};
  color: ${(props) =>
    props.$active ? theme.colors.brand.primary : theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily.base};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${(props) =>
    props.$active
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.medium};
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.slate[100]};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.border.focus};
    outline-offset: -2px;
  }

  &:disabled {
    color: ${theme.colors.text.muted};
    cursor: not-allowed;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  /** Render as an anchor instead of a button. */
  as?: React.ElementType;
  href?: string;
}

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ active = false, icon, children, as, ...props }, ref) => (
    <li>
      <StyledItem
        ref={ref}
        as={as}
        type={as ? undefined : 'button'}
        $active={active}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {icon && <IconSlot aria-hidden="true">{icon}</IconSlot>}
        {children}
      </StyledItem>
    </li>
  ),
);
MenuItem.displayName = 'Menu.Item';

export interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {}

const MenuRoot = React.forwardRef<HTMLUListElement, MenuProps>((props, ref) => (
  <MenuList ref={ref} role="menu" {...props} />
));
MenuRoot.displayName = 'Menu';

/**
 * Menu Component
 * @example
 * <Menu>
 *   <Menu.Item active icon={<Icon>…</Icon>}>Pipeline</Menu.Item>
 *   <Menu.Item>Paramètres</Menu.Item>
 * </Menu>
 */
export const Menu = Object.assign(MenuRoot, { Item: MenuItem });
