/**
 * Modal Component
 * Controlled dialog centered over a dimmed overlay.
 * Closes on Escape and overlay click; renders nothing when closed.
 */

import React, { useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/ui/theme';

export type ModalSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<ModalSize, string> = {
  sm: '420px',
  md: '560px',
  lg: '760px',
};

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const scaleIn = keyframes`
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
  background-color: rgba(15, 23, 42, 0.5);
  animation: ${fadeIn} 150ms ease;
`;

const Dialog = styled.div<{ $size: ModalSize }>`
  width: 100%;
  max-width: ${(props) => sizeMap[props.$size]};
  max-height: calc(100vh - ${theme.spacing[16]});
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.surface};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.lg};
  animation: ${scaleIn} 180ms ease;
  overflow: hidden;
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
  padding: ${theme.spacing[6]};
  overflow-y: auto;
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.normal};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.default};
`;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  /** Content rendered in the footer (typically action buttons). */
  footer?: React.ReactNode;
  /** Disable closing when clicking the overlay. */
  disableOverlayClose?: boolean;
  children?: React.ReactNode;
}

/**
 * Modal Component
 * @example
 * <Modal open={open} onClose={close} title="Confirmation" footer={<Button>OK</Button>}>
 *   Êtes-vous sûr ?
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  disableOverlayClose = false,
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
    <Overlay
      onClick={disableOverlayClose ? undefined : onClose}
      role="presentation"
    >
      <Dialog
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
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
        {footer && <Footer>{footer}</Footer>}
      </Dialog>
    </Overlay>
  );
};

Modal.displayName = 'Modal';
