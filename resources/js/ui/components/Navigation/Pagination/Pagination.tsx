/**
 * Pagination Component
 * Compact pagination controls for lists
 */

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/ui/theme';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  justify-content: center;
`;

const PaginationButton = styled.button<{
  $active: boolean;
  $disabled: boolean;
}>`
  min-width: 32px;
  height: 32px;
  padding: 0 ${theme.spacing[2]};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.radius.md};
  background-color: ${(props) =>
    props.$active
      ? theme.colors.brand.primary
      : theme.colors.background.surface};
  color: ${(props) =>
    props.$active ? theme.colors.text.onPrimary : theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.border.strong};
    background-color: ${(props) =>
      props.$active
        ? theme.colors.brand.primaryHover
        : theme.colors.slate[100]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const PaginationDots = styled.span`
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
`;

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

/**
 * Generate page numbers with ellipsis
 */
function getPageNumbers(
  current: number,
  total: number,
  maxVisible: number,
): (number | string)[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];
  const start = Math.max(2, current - Math.floor(maxVisible / 2));
  const end = Math.min(total - 1, start + maxVisible - 2);

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}

/**
 * Pagination Component
 * @example
 * <Pagination currentPage={1} totalPages={10} onPageChange={setPage} />
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, maxVisible = 7 }, ref) => {
    const pages = getPageNumbers(currentPage, totalPages, maxVisible);

    const handlePrevious = useCallback(() => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    }, [currentPage, totalPages, onPageChange]);

    return (
      <PaginationContainer ref={ref}>
        <PaginationButton
          onClick={handlePrevious}
          $active={false}
          $disabled={currentPage === 1}
        >
          ← Précédent
        </PaginationButton>

        {pages.map((page, idx) =>
          page === '...' ? (
            <PaginationDots key={`dots-${idx}`}>...</PaginationDots>
          ) : (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page as number)}
              $active={page === currentPage}
              $disabled={false}
            >
              {page}
            </PaginationButton>
          ),
        )}

        <PaginationButton
          onClick={handleNext}
          $active={false}
          $disabled={currentPage === totalPages}
        >
          Suivant →
        </PaginationButton>
      </PaginationContainer>
    );
  },
);

Pagination.displayName = 'Pagination';
