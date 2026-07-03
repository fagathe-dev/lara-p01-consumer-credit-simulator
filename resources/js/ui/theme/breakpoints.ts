/**
 * Breakpoints - Design Tokens
 *
 * Points de rupture responsive, alignés sur les tailles de `Container`
 * (sm/md/lg/xl). Utilisés dans les media queries via `theme.breakpoints.*`
 * plutôt que des valeurs en dur.
 */

export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
} as const;

export type Breakpoint = keyof typeof breakpoints;
