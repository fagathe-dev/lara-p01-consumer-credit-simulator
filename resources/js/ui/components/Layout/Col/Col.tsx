/**
 * Col Component
 * Column sized against a 12-column grid, to be used within a Row.
 */

import React from 'react';
import styled from 'styled-components';

const TOTAL_COLUMNS = 12;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns to span (1–12). */
  span?: number;
  /** Column span below the responsive breakpoint (defaults to full width). */
  spanSm?: number;
  /** Breakpoint at which `spanSm` applies. */
  breakpoint?: string;
}

const toBasis = (span: number): string => `${(span / TOTAL_COLUMNS) * 100}%`;

const StyledCol = styled.div<{
  $span: number;
  $spanSm: number;
  $breakpoint: string;
}>`
  flex: 0 0 auto;
  width: calc(${(props) => toBasis(props.$span)} - var(--col-gutter, 0px));
  max-width: ${(props) => toBasis(props.$span)};

  @media (max-width: ${(props) => props.$breakpoint}) {
    width: ${(props) => toBasis(props.$spanSm)};
    max-width: ${(props) => toBasis(props.$spanSm)};
  }
`;

/**
 * Col Component
 * @example
 * <Col span={4}>...</Col>
 */
export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ span = 12, spanSm = 12, breakpoint = '768px', ...props }, ref) => (
    <StyledCol
      ref={ref}
      $span={span}
      $spanSm={spanSm}
      $breakpoint={breakpoint}
      {...props}
    />
  ),
);

Col.displayName = 'Col';
