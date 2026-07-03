/**
 * Tabs Component
 * Switch between content panels with default and pills variants
 */

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type TabsVariant = "default" | "pills";

const TabsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const TabsList = styled.div<{ $variant: TabsVariant }>`
    display: flex;
    gap: ${(props) => (props.$variant === "pills" ? theme.spacing[2] : "0")};
    border-bottom: ${(props) =>
        props.$variant === "default"
            ? `1px solid ${theme.colors.border.default}`
            : "none"};
    padding: ${(props) =>
        props.$variant === "pills" ? theme.spacing[2] : "0"};
`;

const TabButton = styled.button<{ $active: boolean; $variant: TabsVariant }>`
    background: none;
    border: none;
    cursor: pointer;
    font-weight: ${theme.typography.fontWeight.medium};
    font-size: ${theme.typography.fontSize.sm};
    transition: all 150ms ease;
    white-space: nowrap;

    ${(props) => {
        if (props.$variant === "pills") {
            return `
        padding: ${theme.spacing[2]} ${theme.spacing[4]};
        border-radius: ${theme.radius.full};
        color: ${props.$active ? theme.colors.text.onPrimary : theme.colors.text.secondary};
        background-color: ${props.$active ? theme.colors.brand.primary : "transparent"};

        &:hover:not(:disabled) {
          background-color: ${props.$active ? theme.colors.brand.primaryHover : theme.colors.slate[100]};
        }
      `;
        }

        // Default variant
        return `
      padding: ${theme.spacing[4]} ${theme.spacing[4]};
      color: ${props.$active ? theme.colors.brand.primary : theme.colors.text.secondary};
      border-bottom: 2px solid ${props.$active ? theme.colors.brand.primary : "transparent"};

      &:hover:not(:disabled) {
        color: ${theme.colors.brand.primary};
      }
    `;
    }}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: -2px;
    }
`;

const TabContent = styled.div`
    padding: ${theme.spacing[4]} 0;
`;

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    items: TabItem[];
    defaultActiveId?: string;
    variant?: TabsVariant;
    onChange?: (activeId: string) => void;
}

/**
 * Tabs Component
 * @example
 * <Tabs
 *   variant="default"
 *   items={[
 *     { id: 'overview', label: 'Overview', content: <OverviewPanel /> },
 *     { id: 'details', label: 'Details', content: <DetailsPanel /> },
 *   ]}
 * />
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        {
            items,
            defaultActiveId = items[0]?.id,
            variant = "default",
            onChange,
            ...props
        },
        ref,
    ) => {
        const [activeId, setActiveId] = useState(defaultActiveId);

        const handleTabClick = useCallback(
            (id: string) => {
                setActiveId(id);
                onChange?.(id);
            },
            [onChange],
        );

        const activeItem = items.find((item) => item.id === activeId);

        return (
            <TabsContainer ref={ref} {...props}>
                <TabsList $variant={variant} role="tablist">
                    {items.map((item) => (
                        <TabButton
                            key={item.id}
                            role="tab"
                            aria-selected={activeId === item.id}
                            aria-controls={`tab-panel-${item.id}`}
                            $active={activeId === item.id}
                            $variant={variant}
                            onClick={() => handleTabClick(item.id)}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </TabButton>
                    ))}
                </TabsList>
                {activeItem && (
                    <TabContent
                        id={`tab-panel-${activeItem.id}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${activeItem.id}`}
                    >
                        {activeItem.content}
                    </TabContent>
                )}
            </TabsContainer>
        );
    },
);

Tabs.displayName = "Tabs";
