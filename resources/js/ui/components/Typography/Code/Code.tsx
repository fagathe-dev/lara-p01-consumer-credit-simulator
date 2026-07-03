/**
 * Code Component
 * Inline or block monospaced code snippet.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

const InlineCode = styled.code`
    font-family: "SFMono-Regular", "Menlo", "Consolas", monospace;
    font-size: 0.875em;
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
    background-color: ${theme.colors.slate[100]};
    color: ${theme.colors.text.primary};
    border-radius: ${theme.radius.sm};
    border: 1px solid ${theme.colors.border.default};
`;

const BlockCode = styled.pre`
    font-family: "SFMono-Regular", "Menlo", "Consolas", monospace;
    font-size: ${theme.typography.fontSize.sm};
    padding: ${theme.spacing[4]};
    background-color: ${theme.colors.background.inverse};
    color: ${theme.colors.text.onPrimary};
    border-radius: ${theme.radius.md};
    overflow-x: auto;
    line-height: ${theme.typography.lineHeight.normal};
    margin: 0;

    & code {
        font: inherit;
        color: inherit;
    }
`;

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    /** Render as a multi-line block instead of inline. */
    block?: boolean;
}

/**
 * Code Component
 * @example
 * <Code>npm run build</Code>
 * <Code block>{`const x = 1;\nconst y = 2;`}</Code>
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(
    ({ block = false, children, ...props }, ref) =>
        block ? (
            <BlockCode ref={ref as React.Ref<HTMLPreElement>} {...props}>
                <code>{children}</code>
            </BlockCode>
        ) : (
            <InlineCode ref={ref as React.Ref<HTMLElement>} {...props}>
                {children}
            </InlineCode>
        ),
);

Code.displayName = "Code";
