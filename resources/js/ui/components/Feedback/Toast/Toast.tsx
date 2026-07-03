/**
 * Toast Component
 * Transient status notification. Presentational + a fixed-position container
 * for stacking toasts. State/orchestration is left to the consumer.
 */

import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "@/ui/theme";

export type ToastType = "success" | "warning" | "danger" | "info";
export type ToastPosition =
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
`;

const ToastCard = styled.div<{ $type: ToastType }>`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing[3]};
    min-width: 280px;
    max-width: 420px;
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    border-radius: ${theme.radius.md};
    border: 1px solid;
    background-color: ${theme.colors.background.surface};
    box-shadow: ${theme.shadows.lg};
    animation: ${slideIn} 180ms ease;

    ${(props) => {
        const status = theme.colors.status[props.$type];
        return `
      border-color: ${status.border};
      border-left: 4px solid ${status.solid};
    `;
    }}
`;

const Content = styled.div`
    flex: 1;
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
    line-height: ${theme.typography.lineHeight.normal};
`;

const ToastTitle = styled.strong`
    display: block;
    font-weight: ${theme.typography.fontWeight.semibold};
    margin-bottom: ${theme.spacing[1]};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
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

const positionStyles: Record<ToastPosition, string> = {
    "top-right": "top: 1rem; right: 1rem;",
    "top-left": "top: 1rem; left: 1rem;",
    "bottom-right": "bottom: 1rem; right: 1rem;",
    "bottom-left": "bottom: 1rem; left: 1rem;",
};

const Container = styled.div<{ $position: ToastPosition }>`
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[2]};
    ${(props) => positionStyles[props.$position]}
`;

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: ToastType;
    title?: string;
    onClose?: () => void;
}

/**
 * Toast — a single notification card.
 * @example
 * <Toast type="success" title="Dossier enregistré" onClose={dismiss}>
 *   Vos modifications ont été sauvegardées.
 * </Toast>
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({ type = "info", title, onClose, children, ...props }, ref) => (
        <ToastCard
            ref={ref}
            $type={type}
            role="status"
            aria-live="polite"
            {...props}
        >
            <Content>
                {title && <ToastTitle>{title}</ToastTitle>}
                {children}
            </Content>
            {onClose && (
                <CloseButton
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer la notification"
                >
                    ✕
                </CloseButton>
            )}
        </ToastCard>
    ),
);

Toast.displayName = "Toast";

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    position?: ToastPosition;
}

/**
 * ToastContainer — fixed positioning area that stacks toasts.
 * @example
 * <ToastContainer position="top-right">
 *   {toasts.map((t) => <Toast key={t.id} {...t} />)}
 * </ToastContainer>
 */
export const ToastContainer = React.forwardRef<
    HTMLDivElement,
    ToastContainerProps
>(({ position = "top-right", ...props }, ref) => (
    <Container ref={ref} $position={position} {...props} />
));

ToastContainer.displayName = "ToastContainer";
