/**
 * Figure Component
 * Media wrapper pairing content with an optional caption (<figure>/<figcaption>).
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const StyledFigure = styled.figure`
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[2]};
`;

const Caption = styled.figcaption`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    text-align: center;
`;

export interface FigureProps extends React.HTMLAttributes<HTMLElement> {
    /** Caption text displayed below the media. */
    caption?: string;
}

/**
 * Figure Component
 * @example
 * <Figure caption="Répartition des mensualités">
 *   <Image src="/chart.png" alt="Graphique" />
 * </Figure>
 */
export const Figure = React.forwardRef<HTMLElement, FigureProps>(
    ({ caption, children, ...props }, ref) => (
        <StyledFigure ref={ref as React.Ref<HTMLElement>} {...props}>
            {children}
            {caption && <Caption>{caption}</Caption>}
        </StyledFigure>
    ),
);

Figure.displayName = "Figure";
