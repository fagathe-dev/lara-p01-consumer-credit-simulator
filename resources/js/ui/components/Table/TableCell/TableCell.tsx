/**
 * TableCell Component
 * Composable cell rendering either a <td> or a <th> (header), with numeric alignment.
 */

import React from "react";
import styled, { css } from "styled-components";
import { theme } from "@/ui/theme";

const numericStyles = css`
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: ${theme.typography.fontFamily.tabular};
`;

const StyledCell = styled.td<{ $numeric: boolean; $header: boolean }>`
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    color: ${theme.colors.text.primary};
    text-align: left;

    ${(props) =>
        props.$header &&
        css`
            font-weight: ${theme.typography.fontWeight.semibold};
            user-select: none;
        `}

    ${(props) => props.$numeric && numericStyles}
`;

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    /** Render as a header cell (<th>) instead of a data cell (<td>). */
    header?: boolean;
    /** Right-align with tabular figures (financial amounts). */
    numeric?: boolean;
}

/**
 * TableCell Component
 * @example
 * <TableCell header>Montant</TableCell>
 * <TableCell numeric>1 500,00 €</TableCell>
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ header = false, numeric = false, ...props }, ref) => (
        <StyledCell
            ref={ref}
            as={header ? "th" : "td"}
            scope={header ? "col" : undefined}
            $header={header}
            $numeric={numeric}
            {...props}
        />
    ),
);

TableCell.displayName = "TableCell";
