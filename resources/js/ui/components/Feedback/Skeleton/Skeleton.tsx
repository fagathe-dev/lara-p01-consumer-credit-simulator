/**
 * Skeleton Component
 * Loading placeholder with shapes: text, circle, rect
 */

import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "@/ui/theme";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export type SkeletonShape = "text" | "circle" | "rect";

const StyledSkeleton = styled.div<{ $shape: SkeletonShape }>`
    background: linear-gradient(
        90deg,
        ${theme.colors.slate[200]} 0%,
        ${theme.colors.slate[100]} 50%,
        ${theme.colors.slate[200]} 100%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;

    ${(props) => {
        switch (props.$shape) {
            case "circle":
                return `
          border-radius: ${theme.radius.full};
          width: 40px;
          height: 40px;
        `;
            case "rect":
                return `
          border-radius: ${theme.radius.md};
          width: 100%;
          height: 80px;
        `;
            case "text":
            default:
                return `
          border-radius: ${theme.radius.sm};
          width: 100%;
          height: ${theme.typography.fontSize.base};
          margin-bottom: ${theme.spacing[2]};
        `;
        }
    }}
`;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    shape?: SkeletonShape;
    count?: number;
}

/**
 * Skeleton Component
 * @example
 * <Skeleton shape="text" count={3} />
 * <Skeleton shape="circle" />
 * <Skeleton shape="rect" />
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ shape = "text", count = 1, ...props }, ref) => (
        <div ref={ref} {...props}>
            {Array.from({ length: count }).map((_, idx) => (
                <StyledSkeleton key={idx} $shape={shape} />
            ))}
        </div>
    ),
);

Skeleton.displayName = "Skeleton";
