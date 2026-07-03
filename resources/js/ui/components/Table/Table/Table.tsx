/**
 * Table Component
 * Base table with sortable columns, hover states, and tabular figures for numbers
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.fontSize.sm};
  background-color: ${theme.colors.background.surface};
`;

const TableHeader = styled.thead`
  background-color: ${theme.colors.slate[50]};
  border-bottom: 2px solid ${theme.colors.border.default};
`;

const TableHeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  cursor: ${(props) => (props.$sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      props.$sortable ? theme.colors.slate[100] : 'transparent'};
  }
`;

const TableBody = styled.tbody`
  & > tr:hover {
    background-color: ${theme.colors.slate[50]};
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border.default};

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td<{ $numeric?: boolean }>`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.text.primary};
  ${(props) =>
    props.$numeric
      ? `
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: ${theme.typography.fontFamily.tabular};
  `
      : ''}
`;

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<
  T,
> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (column: keyof T) => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Table Component
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name' },
 *     { key: 'amount', label: 'Amount', numeric: true, sortable: true },
 *   ]}
 *   data={[{ name: 'John', amount: 1500 }]}
 * />
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (
    { columns, data, onSort, sortColumn, sortDirection = 'asc', ...props },
    ref,
  ) => (
    <StyledTable ref={ref} {...props}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell
              key={String(column.key)}
              $sortable={column.sortable}
              onClick={() => column.sortable && onSort?.(column.key)}
            >
              {column.label}
              {column.sortable && sortColumn === column.key && (
                <span> {sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map((column) => (
              <TableCell key={String(column.key)} $numeric={column.numeric}>
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  ),
);

Table.displayName = 'Table';
