/**
 * Row Component
 * Horizontal 12-column row (flexbox) meant to hold Col children.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

type SpacingKey = keyof typeof theme.spacing;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gutter between columns using a spacing token key. */
  gap?: SpacingKey;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
}

const StyledRow = styled.div<{
  $gap: SpacingKey;
  $align?: React.CSSProperties['alignItems'];
  $justify?: React.CSSProperties['justifyContent'];
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: ${(props) => props.$align ?? 'stretch'};
  justify-content: ${(props) => props.$justify ?? 'flex-start'};
  gap: ${(props) => theme.spacing[props.$gap]};
`;

/**
 * Row Component
 * @example
 * <Row gap={4}>
 *   <Col span={6}>...</Col>
 *   <Col span={6}>...</Col>
 * </Row>
 */
export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ gap = 4, align, justify, ...props }, ref) => (
    <StyledRow
      ref={ref}
      $gap={gap}
      $align={align}
      $justify={justify}
      {...props}
    />
  ),
);

Row.displayName = 'Row';
