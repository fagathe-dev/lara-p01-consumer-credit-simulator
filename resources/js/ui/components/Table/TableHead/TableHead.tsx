/**
 * TableHead Component
 * Composable <thead> primitive matching the Table styling.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledTableHead = styled.thead`
    background-color: ${theme.colors.slate[50]};
    border-bottom: 2px solid ${theme.colors.border.default};
`;

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * TableHead Component
 * @example
 * <TableHead><TableRow>...</TableRow></TableHead>
 */
export const TableHead = React.forwardRef<
    HTMLTableSectionElement,
    TableHeadProps
>((props, ref) => <StyledTableHead ref={ref} {...props} />);

TableHead.displayName = "TableHead";
