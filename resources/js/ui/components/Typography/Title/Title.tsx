/**
 * Title Component
 * Semantic headings (h1–h6) with a visual level decoupled from the tag.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

const levelStyles: Record<
  TitleLevel,
  {
    size: keyof typeof theme.typography.fontSize;
    weight: keyof typeof theme.typography.fontWeight;
  }
> = {
  1: { size: '4xl', weight: 'bold' },
  2: { size: '3xl', weight: 'bold' },
  3: { size: '2xl', weight: 'semibold' },
  4: { size: 'xl', weight: 'semibold' },
  5: { size: 'lg', weight: 'semibold' },
  6: { size: 'base', weight: 'semibold' },
};

const StyledTitle = styled.h1<{ $level: TitleLevel }>`
  font-family: ${theme.typography.fontFamily.base};
  font-size: ${(props) =>
    theme.typography.fontSize[levelStyles[props.$level].size]};
  font-weight: ${(props) =>
    theme.typography.fontWeight[levelStyles[props.$level].weight]};
  line-height: ${theme.typography.lineHeight.tight};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading tag (h1–h6). Defaults to matching `level`. */
  as?: `h${TitleLevel}`;
  /** Visual size level. */
  level?: TitleLevel;
}

/**
 * Title Component
 * @example
 * <Title level={1}>Simulateur de crédit</Title>
 * <Title as="h2" level={4}>Sous-titre visuellement plus petit</Title>
 */
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ level = 1, as, ...props }, ref) => (
    <StyledTitle
      ref={ref}
      as={as ?? (`h${level}` as const)}
      $level={level}
      {...props}
    />
  ),
);

Title.displayName = 'Title';
