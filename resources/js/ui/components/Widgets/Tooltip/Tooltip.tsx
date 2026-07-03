/**
 * Tooltip Component
 * Displays help text on hover with configurable delay and position
 */

import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{
  $visible: boolean;
  $position: TooltipPosition;
}>`
  position: absolute;
  background-color: ${theme.colors.background.inverse};
  color: white;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.xs};
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 150ms ease;

  ${(props) => {
    switch (props.$position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: ${theme.spacing[2]};
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: ${theme.spacing[2]};
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: ${theme.spacing[2]};
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: ${theme.spacing[2]};
        `;
      default:
        return '';
    }
  }}

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${(props) => {
      switch (props.$position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            margin-left: -4px;
            border-width: 4px 4px 0 4px;
            border-color: ${theme.colors.background.inverse} transparent transparent transparent;
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            margin-left: -4px;
            border-width: 0 4px 4px 4px;
            border-color: transparent transparent ${theme.colors.background.inverse} transparent;
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            margin-top: -4px;
            border-width: 4px 0 4px 4px;
            border-color: transparent transparent transparent ${theme.colors.background.inverse};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            margin-top: -4px;
            border-width: 4px 4px 4px 0;
            border-color: transparent ${theme.colors.background.inverse} transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }
`;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
}

/**
 * Tooltip Component
 * @example
 * <Tooltip content="This is helpful information" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, position = 'top', delay = 300, children, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = useCallback(() => {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, delay);
    }, [delay]);

    const handleMouseLeave = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setVisible(false);
    }, []);

    return (
      <TooltipContainer
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        <TooltipContent $visible={visible} $position={position}>
          {content}
        </TooltipContent>
      </TooltipContainer>
    );
  },
);

Tooltip.displayName = 'Tooltip';
