/**
 * Stack Component
 * Vertical (or horizontal) stack with consistent spacing between children.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

type SpacingKey = keyof typeof theme.spacing;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing token between children. */
  gap?: SpacingKey;
  /** Stack direction. */
  direction?: 'vertical' | 'horizontal';
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
}

const StyledStack = styled.div<{
  $gap: SpacingKey;
  $direction: 'vertical' | 'horizontal';
  $align?: React.CSSProperties['alignItems'];
  $justify?: React.CSSProperties['justifyContent'];
}>`
  display: flex;
  flex-direction: ${(props) =>
    props.$direction === 'vertical' ? 'column' : 'row'};
  align-items: ${(props) => props.$align ?? 'stretch'};
  justify-content: ${(props) => props.$justify ?? 'flex-start'};
  gap: ${(props) => theme.spacing[props.$gap]};
`;

/**
 * Stack Component
 * @example
 * <Stack gap={4}>
 *   <Field ... />
 *   <Field ... />
 * </Stack>
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, direction = 'vertical', align, justify, ...props }, ref) => (
    <StyledStack
      ref={ref}
      $gap={gap}
      $direction={direction}
      $align={align}
      $justify={justify}
      {...props}
    />
  ),
);

Stack.displayName = 'Stack';
