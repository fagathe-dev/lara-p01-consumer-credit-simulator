/**
 * SelectableAutocomplete Component
 * A "select2"-like autocomplete built with styled-components only (no external
 * dependency such as react-select / downshift).
 *
 * - Text input with label
 * - Dropdown list appearing under the field as the user types
 *   - Optional section header (sectionLabel)
 *   - Filtered, clickable results (click fills the field and closes the list)
 * - Full keyboard navigation (↓/↑ to move, Enter to validate, Escape to close)
 *   following the ARIA `combobox` pattern
 * - Supports synchronous `options` OR asynchronous `onSearch` (e.g. city lookup by postal code)
 */

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export interface AutocompleteOption {
    label: string;
    value: string;
}

export interface SelectableAutocompleteProps {
    /** Current text value of the field (controlled). */
    value: string;
    /** Called when the field text changes (typing or selecting an option). */
    onChange: (value: string) => void;
    /** Static list of options (synchronous usage). */
    options?: AutocompleteOption[];
    /** Async resolver, e.g. remote city lookup by postal code. Takes precedence over `options`. */
    onSearch?: (query: string) => Promise<AutocompleteOption[]>;
    /** Optional field label. */
    label?: string;
    /** Optional header displayed above the results (e.g. "Sélectionnez votre ville :"). */
    sectionLabel?: string;
    /** Message shown when no result matches. */
    noResultsLabel?: string;
    /** Input placeholder. */
    placeholder?: string;
    /** Disable the field. */
    disabled?: boolean;
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[1]};
`;

const FieldLabel = styled.label`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
`;

const TextInput = styled.input`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.base};
    font-family: ${theme.typography.fontFamily.base};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.radius.md};
    background-color: ${theme.colors.background.surface};
    color: ${theme.colors.text.primary};
    transition: all 150ms ease;
    width: 100%;

    &:hover:not(:disabled) {
        border-color: ${theme.colors.border.strong};
    }

    &:focus {
        outline: none;
        border-color: ${theme.colors.border.focus};
        box-shadow: 0 0 0 3px ${theme.colors.brand.primarySubtle};
    }

    &:disabled {
        background-color: ${theme.colors.slate[100]};
        color: ${theme.colors.text.muted};
        cursor: not-allowed;
        opacity: 0.6;
    }

    &::placeholder {
        color: ${theme.colors.text.muted};
    }
`;

const Dropdown = styled.ul`
    position: absolute;
    top: calc(100% + ${theme.spacing[1]});
    left: 0;
    right: 0;
    z-index: 1000;
    margin: 0;
    padding: ${theme.spacing[1]};
    list-style: none;
    background-color: ${theme.colors.background.surface};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.radius.md};
    box-shadow: ${theme.shadows.lg};
    max-height: 280px;
    overflow-y: auto;
`;

const SectionHeader = styled.li`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const OptionItem = styled.li<{ $active: boolean }>`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border-radius: ${theme.radius.sm};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
    cursor: pointer;
    background-color: ${(props) =>
        props.$active ? theme.colors.brand.primarySubtle : "transparent"};

    &:hover {
        background-color: ${theme.colors.brand.primarySubtle};
    }
`;

const NoResults = styled.li`
    padding: ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    text-align: center;
`;

/**
 * SelectableAutocomplete
 * @example
 * // Synchronous
 * <SelectableAutocomplete
 *   label="Ville ou code postal"
 *   sectionLabel="Sélectionnez votre ville :"
 *   value={city}
 *   onChange={setCity}
 *   options={cities}
 * />
 *
 * // Asynchronous
 * <SelectableAutocomplete
 *   label="Ville ou code postal"
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={(q) => fetchCities(q)}
 * />
 */
export const SelectableAutocomplete: React.FC<SelectableAutocompleteProps> = ({
    value,
    onChange,
    options,
    onSearch,
    label,
    sectionLabel,
    noResultsLabel = "Aucun résultat",
    placeholder,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [results, setResults] = useState<AutocompleteOption[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;

    // Resolve results from either the async resolver or the static options.
    useEffect(() => {
        let cancelled = false;
        const query = value.trim();

        if (!open) {
            return;
        }

        if (onSearch) {
            onSearch(query)
                .then((res) => {
                    if (!cancelled) setResults(res);
                })
                .catch(() => {
                    if (!cancelled) setResults([]);
                });
            return () => {
                cancelled = true;
            };
        }

        const source = options ?? [];
        const filtered = query
            ? source.filter((opt) =>
                  opt.label.toLowerCase().includes(query.toLowerCase()),
              )
            : source;
        setResults(filtered);

        return () => {
            cancelled = true;
        };
    }, [value, open, options, onSearch]);

    // Close on outside click.
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selectOption = useCallback(
        (option: AutocompleteOption) => {
            onChange(option.label);
            setOpen(false);
            setActiveIndex(-1);
        },
        [onChange],
    );

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
        },
        [onChange],
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    if (!open) {
                        setOpen(true);
                        return;
                    }
                    setActiveIndex((prev) =>
                        results.length === 0 ? -1 : (prev + 1) % results.length,
                    );
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    if (!open) return;
                    setActiveIndex((prev) =>
                        results.length === 0
                            ? -1
                            : (prev - 1 + results.length) % results.length,
                    );
                    break;
                case "Enter":
                    if (open && activeIndex >= 0 && results[activeIndex]) {
                        event.preventDefault();
                        selectOption(results[activeIndex]);
                    }
                    break;
                case "Escape":
                    setOpen(false);
                    setActiveIndex(-1);
                    break;
                default:
                    break;
            }
        },
        [open, results, activeIndex, selectOption],
    );

    const showDropdown = open;

    return (
        <Wrapper ref={wrapperRef}>
            {label && <FieldLabel htmlFor={baseId}>{label}</FieldLabel>}
            <TextInput
                id={baseId}
                type="text"
                role="combobox"
                aria-expanded={showDropdown}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                    activeIndex >= 0
                        ? `${baseId}-opt-${activeIndex}`
                        : undefined
                }
                autoComplete="off"
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
            />
            {showDropdown && (
                <Dropdown id={listboxId} role="listbox" aria-label={label}>
                    {sectionLabel && results.length > 0 && (
                        <SectionHeader aria-hidden="true">
                            {sectionLabel}
                        </SectionHeader>
                    )}
                    {results.length === 0 ? (
                        <NoResults>{noResultsLabel}</NoResults>
                    ) : (
                        results.map((option, index) => (
                            <OptionItem
                                key={option.value}
                                id={`${baseId}-opt-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                $active={index === activeIndex}
                                onMouseDown={(event) => {
                                    // Prevent input blur before click handler runs.
                                    event.preventDefault();
                                    selectOption(option);
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {option.label}
                            </OptionItem>
                        ))
                    )}
                </Dropdown>
            )}
        </Wrapper>
    );
};

SelectableAutocomplete.displayName = "SelectableAutocomplete";
