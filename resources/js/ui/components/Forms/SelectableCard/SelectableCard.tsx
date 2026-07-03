/**
 * SelectableCard Component — "card" variant
 * Clickable card for single/multiple choice in a form (e.g. project type in the tunnel).
 *
 * Grid variant: icon on top, label below, centered, thin border at rest.
 * When selected: full colored background (brand.primary), icon + text switch to text.onPrimary.
 *
 * Controlled: the parent owns which card is selected (no persistent internal state).
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export interface SelectableCardProps {
    /** Whether this card is currently selected (controlled by parent). */
    selected: boolean;
    /** Called when the user activates the card. */
    onSelect: () => void;
    /** Main text label. */
    label: string;
    /** Optional icon rendered above the label (card variant only). */
    icon?: React.ReactNode;
    /** Disable interaction. */
    disabled?: boolean;
    /** Accessible role: "radio" for single choice, "checkbox" for multiple. */
    role?: "radio" | "checkbox";
}

const CardButton = styled.button<{ $selected: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing[3]};
    width: 100%;
    min-height: 120px;
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
    border-radius: ${theme.radius.lg};
    border: 1px solid
        ${(props) =>
            props.$selected
                ? theme.colors.brand.primary
                : theme.colors.border.default};
    background-color: ${(props) =>
        props.$selected
            ? theme.colors.brand.primary
            : theme.colors.background.surface};
    color: ${(props) =>
        props.$selected
            ? theme.colors.text.onPrimary
            : theme.colors.text.primary};
    cursor: pointer;
    transition: all 150ms ease;
    text-align: center;

    &:hover:not(:disabled) {
        border-color: ${(props) =>
            props.$selected
                ? theme.colors.brand.primaryHover
                : theme.colors.border.strong};
        background-color: ${(props) =>
            props.$selected
                ? theme.colors.brand.primaryHover
                : theme.colors.brand.primarySubtle};
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const IconSlot = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${theme.typography.fontSize["3xl"]};
    line-height: 1;
`;

const CardLabel = styled.span`
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semibold};
`;

/**
 * SelectableCard (card variant)
 * @example
 * <SelectableCard
 *   label="Auto"
 *   icon={<CarIcon />}
 *   selected={value === "auto"}
 *   onSelect={() => setValue("auto")}
 * />
 */
export const SelectableCard = React.forwardRef<
    HTMLButtonElement,
    SelectableCardProps
>(
    (
        { selected, onSelect, label, icon, disabled = false, role = "radio" },
        ref,
    ) => (
        <CardButton
            ref={ref}
            type="button"
            $selected={selected}
            onClick={onSelect}
            disabled={disabled}
            role={role}
            aria-checked={selected}
        >
            {icon && <IconSlot aria-hidden="true">{icon}</IconSlot>}
            <CardLabel>{label}</CardLabel>
        </CardButton>
    ),
);

SelectableCard.displayName = "SelectableCard";
