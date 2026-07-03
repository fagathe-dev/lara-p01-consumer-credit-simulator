/**
 * Popover Component
 * Floating content anchored to a trigger, toggled on click.
 * Closes on outside click and Escape. Positioning is CSS-based (no portal).
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

const Anchor = styled.div`
    position: relative;
    display: inline-block;
`;

const Content = styled.div<{ $placement: PopoverPlacement }>`
    position: absolute;
    z-index: 1000;
    min-width: 200px;
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    background-color: ${theme.colors.background.surface};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.radius.md};
    box-shadow: ${theme.shadows.md};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};

    ${(props) => {
        switch (props.$placement) {
            case "top":
                return `bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: ${theme.spacing[2]};`;
            case "left":
                return `right: 100%; top: 50%; transform: translateY(-50%); margin-right: ${theme.spacing[2]};`;
            case "right":
                return `left: 100%; top: 50%; transform: translateY(-50%); margin-left: ${theme.spacing[2]};`;
            case "bottom":
            default:
                return `top: 100%; left: 50%; transform: translateX(-50%); margin-top: ${theme.spacing[2]};`;
        }
    }}
`;

export interface PopoverProps {
    /** Element that toggles the popover on click. */
    trigger: React.ReactNode;
    placement?: PopoverPlacement;
    children?: React.ReactNode;
}

/**
 * Popover Component
 * @example
 * <Popover trigger={<Button>Options</Button>} placement="bottom">
 *   <Menu>...</Menu>
 * </Popover>
 */
export const Popover: React.FC<PopoverProps> = ({
    trigger,
    placement = "bottom",
    children,
}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                close();
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, close]);

    return (
        <Anchor ref={anchorRef}>
            <div
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                {trigger}
            </div>
            {open && (
                <Content $placement={placement} role="dialog">
                    {children}
                </Content>
            )}
        </Anchor>
    );
};

Popover.displayName = "Popover";
