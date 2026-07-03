/**
 * ProgressSteps Component
 * Horizontal row of SECTION markers for the tunnel header.
 *
 * Each marker = one section, with a numbered/checked badge + a text label and
 * connectors between markers. The fine-grained per-step progress is handled by
 * `ProgressBar`, not here.
 *
 * States:
 *  - done → filled badge (brand.primary) with a check (✓)
 *  - current → filled badge (brand.primary) with the section number, bold label
 *  - upcoming → muted badge with the number, muted label
 *
 * Responsive: below `sm`, per-marker labels are hidden (compact badges + a
 * single caption "Section {n}/{total} — {label}") so 5 markers never overflow.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

export type ProgressSectionStatus = 'done' | 'current' | 'upcoming';

export interface ProgressSection {
  key: string;
  label: string;
  status: ProgressSectionStatus;
}

export interface ProgressStepsProps {
  /** Ordered list of sections. */
  sections: ProgressSection[];
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  width: 100%;
`;

const StepsContainer = styled.ol`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const StepItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  flex: 1;
  min-width: 0;

  &:last-child {
    flex: 0 0 auto;
  }
`;

const StepBadge = styled.span<{ $status: ProgressSectionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: ${theme.radius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: 1px solid
    ${(props) =>
      props.$status === 'upcoming'
        ? theme.colors.border.default
        : theme.colors.brand.primary};
  background-color: ${(props) =>
    props.$status === 'upcoming'
      ? theme.colors.background.surface
      : theme.colors.brand.primary};
  color: ${(props) =>
    props.$status === 'upcoming'
      ? theme.colors.text.muted
      : theme.colors.text.onPrimary};
`;

const StepLabel = styled.span<{ $status: ProgressSectionStatus }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${(props) =>
    props.$status === 'current'
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.medium};
  color: ${(props) =>
    props.$status === 'upcoming'
      ? theme.colors.text.muted
      : theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Sur mobile, les libellés par marqueur sont masqués (voir MobileCaption). */
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const StepConnector = styled.span<{ $filled: boolean }>`
  flex: 1;
  height: 2px;
  min-width: ${theme.spacing[3]};
  border-radius: ${theme.radius.full};
  background-color: ${(props) =>
    props.$filled ? theme.colors.brand.primary : theme.colors.slate[200]};
`;

/** Libellé condensé de la section courante, visible uniquement sur mobile. */
const MobileCaption = styled.p`
  display: none;
  margin: 0;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.sm}) {
    display: block;
  }
`;

/**
 * ProgressSteps
 * @example
 * <ProgressSteps
 *   sections={[
 *     { key: "projet", label: "Votre projet", status: "done" },
 *     { key: "situation", label: "Votre situation", status: "current" },
 *   ]}
 * />
 */
export const ProgressSteps: React.FC<ProgressStepsProps> = ({ sections }) => {
  const currentIndex = sections.findIndex(
    (section) => section.status === 'current',
  );
  const currentSection = currentIndex >= 0 ? sections[currentIndex] : null;

  return (
    <Wrapper>
      <StepsContainer>
        {sections.map((section, index) => {
          const isLast = index === sections.length - 1;
          // Le connecteur est "rempli" jusqu'à la section courante.
          const filled =
            section.status === 'done' &&
            sections[index + 1]?.status !== 'upcoming';
          return (
            <StepItem
              key={section.key}
              aria-current={section.status === 'current' ? 'step' : undefined}
            >
              <StepBadge $status={section.status}>
                {section.status === 'done' ? '✓' : index + 1}
              </StepBadge>
              <StepLabel $status={section.status}>{section.label}</StepLabel>
              {!isLast && <StepConnector aria-hidden="true" $filled={filled} />}
            </StepItem>
          );
        })}
      </StepsContainer>
      {currentSection && (
        <MobileCaption>
          Section {currentIndex + 1}/{sections.length} — {currentSection.label}
        </MobileCaption>
      )}
    </Wrapper>
  );
};

ProgressSteps.displayName = 'ProgressSteps';
