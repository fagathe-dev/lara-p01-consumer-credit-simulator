/**
 * Radio Component
 * Styled radio button with checked and disabled states
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const RadioWrapper = styled.label`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    cursor: pointer;
    user-select: none;
`;

const HiddenRadio = styled.input.attrs({ type: "radio" })`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    cursor: pointer;
`;

const RadioCircle = styled.div<{ $checked: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid ${theme.colors.border.default};
    border-radius: ${theme.radius.full};
    background-color: ${theme.colors.background.surface};
    transition: all 150ms ease;
    flex-shrink: 0;

    &::after {
        content: "";
        width: ${(props) => (props.$checked ? "8px" : "0px")};
        height: ${(props) => (props.$checked ? "8px" : "0px")};
        border-radius: ${theme.radius.full};
        background-color: ${theme.colors.brand.primary};
        transition: all 150ms ease;
    }

    ${HiddenRadio}:hover:not(:disabled) + & {
        border-color: ${theme.colors.border.strong};
    }

    ${HiddenRadio}:focus-visible + & {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }

    ${HiddenRadio}:disabled + & {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const RadioLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
`;

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

/**
 * Radio Component
 * @example
 * <Radio name="option" value="option1" label="Option 1" />
 * <Radio name="option" value="option2" label="Option 2" />
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ label, ...props }, ref) => (
        <RadioWrapper>
            <HiddenRadio ref={ref} {...props} />
            <RadioCircle $checked={props.checked as boolean} />
            {label && <RadioLabel>{label}</RadioLabel>}
        </RadioWrapper>
    ),
);

Radio.displayName = "Radio";
