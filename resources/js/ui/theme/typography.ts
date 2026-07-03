/**
 * Typography System - Design Tokens
 * Single typeface: Inter (variable font)
 * Tabular figures for financial amounts
 */

export const typography = {
    fontFamily: {
        base: "'Inter', system-ui, -apple-system, sans-serif",
        tabular: "'Inter', system-ui, -apple-system, sans-serif", // Use with fontVariantNumeric: 'tabular-nums'
    },
    fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
    },
    fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.2, // For headings
        normal: 1.5, // For body text
        relaxed: 1.75, // For long paragraphs (legal mentions)
    },
} as const;
