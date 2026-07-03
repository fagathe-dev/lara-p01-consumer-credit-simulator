/**
 * Flex Component
 * Thin styled wrapper around CSS flexbox with token-based gap.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

type SpacingKey = keyof typeof theme.spacing;

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: React.CSSProperties['flexDirection'];
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: React.CSSProperties['flexWrap'];
  /** Gap using a spacing token key. */
  gap?: SpacingKey;
  inline?: boolean;
}

const StyledFlex = styled.div<{
  $direction: React.CSSProperties['flexDirection'];
  $align?: React.CSSProperties['alignItems'];
  $justify?: React.CSSProperties['justifyContent'];
  $wrap?: React.CSSProperties['flexWrap'];
  $gap: SpacingKey;
  $inline: boolean;
}>`
  display: ${(props) => (props.$inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.$direction};
  align-items: ${(props) => props.$align ?? 'stretch'};
  justify-content: ${(props) => props.$justify ?? 'flex-start'};
  flex-wrap: ${(props) => props.$wrap ?? 'nowrap'};
  gap: ${(props) => theme.spacing[props.$gap]};
`;

/**
 * Flex Component
 * @example
 * <Flex align="center" justify="space-between" gap={4}>...</Flex>
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = 'row',
      align,
      justify,
      wrap,
      gap = 0,
      inline = false,
      ...props
    },
    ref,
  ) => (
    <StyledFlex
      ref={ref}
      $direction={direction}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $gap={gap}
      $inline={inline}
      {...props}
    />
  ),
);

Flex.displayName = 'Flex';
