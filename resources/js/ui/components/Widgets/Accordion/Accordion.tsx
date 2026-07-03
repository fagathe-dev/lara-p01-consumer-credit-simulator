/**
 * Accordion Component
 * Vertically stacked, collapsible panels. Supports single or multiple open
 * items. Controlled internally by default (uncontrolled usage).
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  background-color: ${theme.colors.background.surface};
`;

const Item = styled.div`
  border-bottom: 1px solid ${theme.colors.border.default};

  &:last-child {
    border-bottom: none;
  }
`;

const Trigger = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border: none;
  background-color: ${(props) =>
    props.$open ? theme.colors.slate[50] : 'transparent'};
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily.base};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${theme.colors.slate[50]};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.border.focus};
    outline-offset: -2px;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  color: ${theme.colors.text.muted};
  transition: transform 150ms ease;
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
`;

const Panel = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.normal};
`;

export interface AccordionItem {
  /** Stable identifier for the item. */
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  /** Ids open on first render. */
  defaultOpen?: string[];
}

/**
 * Accordion Component
 * @example
 * <Accordion items={[{ id: "faq1", title: "…", content: <p>…</p> }]} />
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  defaultOpen = [],
  ...props
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((current) => {
        const isOpen = current.includes(id);
        if (multiple) {
          return isOpen ? current.filter((x) => x !== id) : [...current, id];
        }
        return isOpen ? [] : [id];
      });
    },
    [multiple],
  );

  return (
    <Container {...props}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;
        return (
          <Item key={item.id}>
            <Trigger
              id={triggerId}
              type="button"
              $open={isOpen}
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
            >
              {item.title}
              <Chevron $open={isOpen} aria-hidden="true">
                ▾
              </Chevron>
            </Trigger>
            {isOpen && (
              <Panel id={panelId} role="region" aria-labelledby={triggerId}>
                {item.content}
              </Panel>
            )}
          </Item>
        );
      })}
    </Container>
  );
};

Accordion.displayName = 'Accordion';
