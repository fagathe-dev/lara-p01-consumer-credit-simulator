/**
 * ProgressBar Component
 * Thin linear progress bar with an optional accompanying label above it.
 * Fill is proportional in brand.primary over a slate[200] track.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export interface ProgressBarProps {
  /** Progression from 0 to 100. */
  value: number;
  /** Optional accompanying label (e.g. "Étape 2 sur 5"). */
  label?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  width: 100%;
`;

const BarLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
`;

const Track = styled.div`
  width: 100%;
  height: 6px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.slate[200]};
  overflow: hidden;
`;

const Fill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${(props) => props.$value}%;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.brand.primary};
  transition: width 200ms ease;
`;

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/**
 * ProgressBar
 * @example
 * <ProgressBar value={40} label="Étape 2 sur 5" />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  const safeValue = clamp(value);
  return (
    <Container>
      {label && <BarLabel>{label}</BarLabel>}
      <Track
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <Fill $value={safeValue} />
      </Track>
    </Container>
  );
};

ProgressBar.displayName = 'ProgressBar';
