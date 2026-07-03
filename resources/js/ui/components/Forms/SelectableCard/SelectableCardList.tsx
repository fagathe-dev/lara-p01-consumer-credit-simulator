/**
 * SelectableCardList Component — "list" variant
 * Full-width clickable row for single/multiple choice in a form.
 *
 * List variant: full-width row, rounded border, leading chevron/arrow, label aligned left.
 * When selected: reinforced border + filled/subtle background and a trailing check mark.
 *
 * Controlled: the parent owns which row is selected (no persistent internal state).
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export interface SelectableCardListProps {
    /** Whether this row is currently selected (controlled by parent). */
    selected: boolean;
    /** Called when the user activates the row. */
    onSelect: () => void;
    /** Main text label. */
    label: string;
    /** Disable interaction. */
    disabled?: boolean;
    /** Accessible role: "radio" for single choice, "checkbox" for multiple. */
    role?: "radio" | "checkbox";
}

const RowButton = styled.button<{ $selected: boolean }>`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[3]};
    width: 100%;
    padding: ${theme.spacing[4]} ${theme.spacing[4]};
    border-radius: ${theme.radius.lg};
    border: 1px solid
        ${(props) =>
            props.$selected
                ? theme.colors.brand.primary
                : theme.colors.border.default};
    background-color: ${(props) =>
        props.$selected
            ? theme.colors.brand.primarySubtle
            : theme.colors.background.surface};
    color: ${theme.colors.text.primary};
    cursor: pointer;
    transition: all 150ms ease;
    text-align: left;
    box-shadow: ${(props) =>
        props.$selected
            ? `inset 0 0 0 1px ${theme.colors.brand.primary}`
            : "none"};

    &:hover:not(:disabled) {
        border-color: ${theme.colors.border.strong};
        background-color: ${(props) =>
            props.$selected
                ? theme.colors.brand.primarySubtle
                : theme.colors.slate[50]};
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

const Chevron = styled.span<{ $selected: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: ${theme.typography.fontSize.lg};
    color: ${(props) =>
        props.$selected ? theme.colors.brand.primary : theme.colors.text.muted};
`;

const RowLabel = styled.span`
    flex: 1;
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const CheckMark = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${theme.colors.brand.primary};
    font-size: ${theme.typography.fontSize.lg};
`;

/**
 * SelectableCardList (list variant)
 * @example
 * <SelectableCardList
 *   label="Rachat de crédits"
 *   selected={value === "rachat"}
 *   onSelect={() => setValue("rachat")}
 * />
 */
export const SelectableCardList = React.forwardRef<
    HTMLButtonElement,
    SelectableCardListProps
>(({ selected, onSelect, label, disabled = false, role = "radio" }, ref) => (
    <RowButton
        ref={ref}
        type="button"
        $selected={selected}
        onClick={onSelect}
        disabled={disabled}
        role={role}
        aria-checked={selected}
    >
        <Chevron $selected={selected} aria-hidden="true">
            ›
        </Chevron>
        <RowLabel>{label}</RowLabel>
        {selected && <CheckMark aria-hidden="true">✓</CheckMark>}
    </RowButton>
));

SelectableCardList.displayName = "SelectableCardList";
