/**
 * Image Component
 * Responsive image with object-fit, rounding and a fixed aspect ratio option.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

const radiusMap: Record<ImageRadius, string> = {
  none: '0',
  sm: theme.radius.sm,
  md: theme.radius.md,
  lg: theme.radius.lg,
  full: theme.radius.full,
};

const StyledImage = styled.img<{
  $radius: ImageRadius;
  $fit: ImageFit;
  $ratio?: string;
}>`
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: ${(props) => props.$fit};
  border-radius: ${(props) => radiusMap[props.$radius]};
  ${(props) =>
    props.$ratio
      ? `
        width: 100%;
        height: auto;
        aspect-ratio: ${props.$ratio};
        object-fit: ${props.$fit};
      `
      : ''}
`;

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  radius?: ImageRadius;
  fit?: ImageFit;
  /** CSS aspect-ratio value, e.g. "16 / 9". */
  ratio?: string;
}

/**
 * Image Component
 * @example
 * <Image src="/hero.jpg" alt="Accueil" ratio="16 / 9" radius="lg" />
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      radius = 'none',
      fit = 'cover',
      ratio,
      alt = '',
      loading = 'lazy',
      ...props
    },
    ref,
  ) => (
    <StyledImage
      ref={ref}
      alt={alt}
      loading={loading}
      $radius={radius}
      $fit={fit}
      $ratio={ratio}
      {...props}
    />
  ),
);

Image.displayName = 'Image';
