/**
 * Theme - Centralized Design Token Export
 * Used with styled-components for type-safe theme access
 */

import {
  mauve,
  slate,
  taupe,
  success,
  warning,
  danger,
  info,
  semanticColors,
} from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { breakpoints } from './breakpoints';

export const theme = {
  colors: {
    mauve,
    slate,
    taupe,
    primary: mauve,
    secondary: slate,
    tertiary: taupe, // Ajouté comme option tierce/secondaire
    success,
    warning,
    danger,
    info,
    ...semanticColors,
  },
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
} as const;

export type AppTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

// Re-export individual token modules for direct imports if needed
export { mauve, slate, taupe, success, warning, danger, info, semanticColors };
export { typography };
export { spacing };
export { radius };
export { shadows };
export { breakpoints };
export { GlobalStyle } from './GlobalStyle';
