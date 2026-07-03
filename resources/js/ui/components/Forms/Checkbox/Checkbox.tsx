/**
 * Checkbox Component
 * Styled checkbox with checked, indeterminate, and disabled states
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const CheckboxWrapper = styled.label`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    cursor: pointer;
    user-select: none;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    cursor: pointer;
`;

const CheckboxBox = styled.div<{ $checked: boolean; $indeterminate: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid ${theme.colors.border.default};
    border-radius: ${theme.radius.sm};
    background-color: ${(props) =>
        props.$checked || props.$indeterminate
            ? theme.colors.brand.primary
            : theme.colors.background.surface};
    transition: all 150ms ease;
    flex-shrink: 0;

    ${HiddenCheckbox}:hover:not(:disabled) + & {
        border-color: ${theme.colors.border.strong};
    }

    ${HiddenCheckbox}:focus-visible + & {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }

    ${HiddenCheckbox}:disabled + & {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CheckboxLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
`;

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    indeterminate?: boolean;
}

/**
 * Checkbox Component
 * @example
 * <Checkbox label="I agree to terms" checked={isChecked} onChange={handleChange} />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, indeterminate = false, ...props }, ref) => (
        <CheckboxWrapper>
            <HiddenCheckbox ref={ref} {...props} />
            <CheckboxBox
                $checked={props.checked as boolean}
                $indeterminate={indeterminate}
            >
                {indeterminate && <span style={{ fontSize: "14px" }}>−</span>}
                {!indeterminate && (props.checked as boolean) && (
                    <span style={{ fontSize: "14px" }}>✓</span>
                )}
            </CheckboxBox>
            {label && <CheckboxLabel>{label}</CheckboxLabel>}
        </CheckboxWrapper>
    ),
);

Checkbox.displayName = "Checkbox";
