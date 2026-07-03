/**
 * Spacer Component
 * Empty flexible/box element used to insert space between elements.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

type SpacingKey = keyof typeof theme.spacing;

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed size using a spacing token key. Ignored when `grow` is set. */
  size?: SpacingKey;
  /** Axis on which the fixed size applies. */
  axis?: 'vertical' | 'horizontal';
  /** When true, expands to fill available space (flex: 1). */
  grow?: boolean;
}

const StyledSpacer = styled.div<{
  $size: SpacingKey;
  $axis: 'vertical' | 'horizontal';
  $grow: boolean;
}>`
  flex-shrink: 0;

  ${(props) =>
    props.$grow
      ? `flex: 1 1 auto;`
      : props.$axis === 'vertical'
        ? `height: ${theme.spacing[props.$size]}; width: 100%;`
        : `width: ${theme.spacing[props.$size]}; height: 100%;`}
`;

/**
 * Spacer Component
 * @example
 * <Spacer size={6} />          // 24px vertical gap
 * <Spacer axis="horizontal" size={4} />
 * <Spacer grow />              // fills remaining space in a flex row
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 4, axis = 'vertical', grow = false, ...props }, ref) => (
    <StyledSpacer
      ref={ref}
      aria-hidden="true"
      $size={size}
      $axis={axis}
      $grow={grow}
      {...props}
    />
  ),
);

Spacer.displayName = 'Spacer';
