/**
 * Loader Component
 * Spinner + optional label, usable inline, as a block, or as a full-area overlay.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";
import { Spinner, type SpinnerSize } from "@/ui/components/Base/Spinner";

const Inline = styled.div<{ $center: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    ${(props) =>
        props.$center
            ? `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: ${theme.spacing[8]};
      `
            : ""}
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing[3]};
    background-color: rgba(255, 255, 255, 0.75);
    z-index: 10;
`;

const LoaderLabel = styled.span`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
`;

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: SpinnerSize;
    label?: string;
    /** Center within its parent block (vertical column). */
    center?: boolean;
    /** Render as an absolute overlay covering the nearest positioned ancestor. */
    overlay?: boolean;
}

/**
 * Loader Component
 * @example
 * <Loader label="Chargement des dossiers…" center />
 * <div style={{ position: "relative" }}><Loader overlay /></div>
 */
export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    (
        { size = "md", label, center = false, overlay = false, ...props },
        ref,
    ) => {
        const content = (
            <>
                <Spinner size={size} label={label ?? "Chargement"} />
                {label && <LoaderLabel>{label}</LoaderLabel>}
            </>
        );

        if (overlay) {
            return (
                <Overlay ref={ref} {...props}>
                    {content}
                </Overlay>
            );
        }

        return (
            <Inline ref={ref} $center={center} {...props}>
                {content}
            </Inline>
        );
    },
);

Loader.displayName = "Loader";
