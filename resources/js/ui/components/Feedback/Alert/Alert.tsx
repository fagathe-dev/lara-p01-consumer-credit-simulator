/**
 * Alert Component
 * Displays status-based alerts: success, warning, danger, info
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type AlertType = "success" | "warning" | "danger" | "info";

interface AlertContainerProps {
    $type: AlertType;
}

const AlertContainer = styled.div<AlertContainerProps>`
    display: flex;
    gap: ${theme.spacing[3]};
    align-items: flex-start;
    padding: ${theme.spacing[4]} ${theme.spacing[4]};
    border-radius: ${theme.radius.md};
    border: 1px solid;
    ${(props) => {
        const status = theme.colors.status[props.$type];
        return `
      background-color: ${status.bg};
      color: ${status.text};
      border-color: ${status.border};
    `;
    }}
`;

const AlertContent = styled.div`
    flex: 1;
    font-size: ${theme.typography.fontSize.sm};
    line-height: ${theme.typography.lineHeight.normal};

    strong {
        font-weight: ${theme.typography.fontWeight.semibold};
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    font-size: ${theme.typography.fontSize.lg};
    line-height: 1;
    padding: 0;
    opacity: 0.7;
    transition: opacity 150ms ease;

    &:hover {
        opacity: 1;
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }
`;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: AlertType;
    onClose?: () => void;
    closeable?: boolean;
    title?: string;
}

/**
 * Alert Component
 * @example
 * <Alert type="success" title="Success!" closeable onClose={() => {}}>
 *   Your changes have been saved successfully.
 * </Alert>
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            type = "info",
            onClose,
            closeable = false,
            title,
            children,
            ...props
        },
        ref,
    ) => (
        <AlertContainer ref={ref} $type={type} role="alert" {...props}>
            <AlertContent>
                {title && <strong>{title}</strong>}
                {title && children && <br />}
                {children}
            </AlertContent>
            {closeable && (
                <CloseButton
                    onClick={onClose}
                    aria-label="Close alert"
                    type="button"
                >
                    ✕
                </CloseButton>
            )}
        </AlertContainer>
    ),
);

Alert.displayName = "Alert";
