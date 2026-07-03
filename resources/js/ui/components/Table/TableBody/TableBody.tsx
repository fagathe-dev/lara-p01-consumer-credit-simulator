/**
 * TableBody Component
 * Composable <tbody> primitive with row hover styling.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledTableBody = styled.tbody`
    & > tr:hover {
        background-color: ${theme.colors.slate[50]};
    }
`;

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * TableBody Component
 * @example
 * <TableBody>{rows}</TableBody>
 */
export const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    TableBodyProps
>((props, ref) => <StyledTableBody ref={ref} {...props} />);

TableBody.displayName = "TableBody";
