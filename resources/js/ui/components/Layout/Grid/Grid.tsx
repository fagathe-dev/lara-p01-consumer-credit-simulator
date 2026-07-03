/**
 * Grid Component
 * CSS grid wrapper with a fixed column count and token-based gap.
 * Columns collapse to a single column below the responsive breakpoint.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

type SpacingKey = keyof typeof theme.spacing;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns on wide viewports. */
  columns?: number;
  /** Gap using a spacing token key. */
  gap?: SpacingKey;
  /** Viewport width below which the grid collapses to one column. */
  collapseBelow?: string;
}

const StyledGrid = styled.div<{
  $columns: number;
  $gap: SpacingKey;
  $collapseBelow: string;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, minmax(0, 1fr));
  gap: ${(props) => theme.spacing[props.$gap]};

  @media (max-width: ${(props) => props.$collapseBelow}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/**
 * Grid Component
 * @example
 * <Grid columns={3} gap={4}>...</Grid>
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 12, gap = 4, collapseBelow = '768px', ...props }, ref) => (
    <StyledGrid
      ref={ref}
      $columns={columns}
      $gap={gap}
      $collapseBelow={collapseBelow}
      {...props}
    />
  ),
);

Grid.displayName = 'Grid';
