/**
 * TableRow Component
 * Composable <tr> primitive with a bottom border and optional clickable state.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const StyledTableRow = styled.tr<{ $clickable: boolean }>`
  border-bottom: 1px solid ${theme.colors.border.default};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:last-child {
    border-bottom: none;
  }
`;

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Renders the row with a pointer cursor for interactive rows. */
  clickable?: boolean;
}

/**
 * TableRow Component
 * @example
 * <TableRow clickable onClick={() => open(row)}>...</TableRow>
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ clickable = false, ...props }, ref) => (
    <StyledTableRow ref={ref} $clickable={clickable} {...props} />
  ),
);

TableRow.displayName = 'TableRow';
