/**
 * Drawer Component
 * Controlled panel sliding in from a screen edge over a dimmed overlay.
 * Closes on Escape and overlay click.
 */

import React, { useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/ui/theme';

export type DrawerSide = 'left' | 'right';

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const slideFromRight = keyframes`
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
`;

const slideFromLeft = keyframes`
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(15, 23, 42, 0.5);
  animation: ${fadeIn} 150ms ease;
`;

const Panel = styled.aside<{ $side: DrawerSide; $width: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${(props) => (props.$side === 'right' ? 'right: 0;' : 'left: 0;')}
  z-index: 1001;
  width: ${(props) => props.$width};
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.surface};
  box-shadow: ${theme.shadows.lg};
  animation: ${(props) =>
      props.$side === 'right' ? slideFromRight : slideFromLeft}
    200ms ease;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[5]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.default};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fontFamily.base};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.xl};
  line-height: 1;
  padding: 0;

  &:hover {
    color: ${theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const Body = styled.div`
  flex: 1;
  padding: ${theme.spacing[6]};
  overflow-y: auto;
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.normal};
`;

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: DrawerSide;
  /** Panel width (CSS value). */
  width?: string;
  children?: React.ReactNode;
}

/**
 * Drawer Component
 * @example
 * <Drawer open={open} onClose={close} title="Filtres" side="right">
 *   ...
 * </Drawer>
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  side = 'right',
  width = '400px',
  children,
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      <Overlay onClick={onClose} role="presentation" />
      <Panel
        $side={side}
        $width={width}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <Header>
            <Heading>{title}</Heading>
            <CloseButton type="button" onClick={onClose} aria-label="Fermer">
              ✕
            </CloseButton>
          </Header>
        )}
        <Body>{children}</Body>
      </Panel>
    </>
  );
};

Drawer.displayName = 'Drawer';
