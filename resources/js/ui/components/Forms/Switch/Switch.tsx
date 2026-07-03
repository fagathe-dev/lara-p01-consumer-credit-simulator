/**
 * Switch Component
 * Styled toggle switch with checked and disabled states
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const SwitchWrapper = styled.label`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[3]};
    cursor: pointer;
    user-select: none;
`;

const HiddenSwitch = styled.input.attrs({ type: "checkbox" })`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    cursor: pointer;
`;

const SwitchTrack = styled.div<{ $checked: boolean }>`
    position: relative;
    width: 44px;
    height: 24px;
    background-color: ${(props) =>
        props.$checked ? theme.colors.brand.primary : theme.colors.slate[300]};
    border-radius: ${theme.radius.full};
    transition: all 150ms ease;
    flex-shrink: 0;

    &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: ${theme.radius.full};
        top: 2px;
        left: ${(props) => (props.$checked ? "22px" : "2px")};
        transition: all 150ms ease;
    }

    ${HiddenSwitch}:hover:not(:disabled) + & {
        box-shadow: 0 0 0 3px ${theme.colors.brand.primarySubtle};
    }

    ${HiddenSwitch}:focus-visible + & {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }

    ${HiddenSwitch}:disabled + & {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const SwitchLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
`;

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

/**
 * Switch Component
 * @example
 * <Switch label="Enable notifications" checked={isEnabled} onChange={handleChange} />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ label, ...props }, ref) => (
        <SwitchWrapper>
            <HiddenSwitch ref={ref} {...props} />
            <SwitchTrack $checked={props.checked as boolean} />
            {label && <SwitchLabel>{label}</SwitchLabel>}
        </SwitchWrapper>
    ),
);

Switch.displayName = "Switch";
