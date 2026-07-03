/**
 * Color System - Design Tokens
 * Premium yet sober financial application color palette
 * No dark mode support
 */

// Primary Palette - Mauve (accent color)
export const mauve = {
  50: '#FAF8FA',
  100: '#F3EFF3',
  200: '#E6DEE6',
  300: '#D1C0D1',
  400: '#B597B6',
  500: '#966F97', // Primary reference color
  600: '#7A5A7C',
  700: '#614763',
  800: '#4C384E',
  900: '#3A2C3C',
  950: '#241B26',
} as const;

// Secondary Palette 1 - Slate (neutral, blue-gray tint)
export const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
} as const;

// Secondary Palette 2 - Taupe (Tailwind 'Stone' - warm gray/brown tint)
export const taupe = {
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
  950: '#0C0A09',
} as const;

// Status Colors
export const success = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
  950: '#052E16',
} as const;

export const warning = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
  950: '#451A03',
} as const;

export const danger = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
  950: '#450A0A',
} as const;

export const info = {
  50: '#F0F9FF',
  100: '#E0F2FE',
  200: '#BAE6FD',
  300: '#7DD3FC',
  400: '#38BDF8',
  500: '#0EA5E9',
  600: '#0284C7',
  700: '#0369A1',
  800: '#075985',
  900: '#0C4A6E',
  950: '#082F49',
} as const;

// Semantic Colors - Use these in components instead of raw palette values
export const semanticColors = {
  background: {
    app: slate[50], // General application background
    surface: '#FFFFFF', // Card/panel backgrounds
    subtle: slate[100], // Secondary zones (sidebar, alternating sections)
    inverse: slate[900], // Dark background (tooltip, footer)
  },
  border: {
    default: slate[200],
    strong: slate[300],
    focus: mauve[400], // For keyboard focus states
  },
  text: {
    primary: slate[900],
    secondary: slate[600],
    muted: slate[400],
    onPrimary: '#FFFFFF', // Text on mauve[500..700] backgrounds
    link: mauve[600],
  },
  brand: {
    primary: mauve[500],
    primaryHover: mauve[600],
    primaryActive: mauve[700],
    primarySubtle: mauve[50], // Light background (e.g., active badge)
    secondary: slate[600], // Ou taupe[600] selon l'usage souhaité
    secondaryHover: slate[700],
  },
  status: {
    success: {
      bg: success[50],
      text: success[700],
      border: success[100],
      solid: success[500],
    },
    warning: {
      bg: warning[50],
      text: warning[700],
      border: warning[100],
      solid: warning[500],
    },
    danger: {
      bg: danger[50],
      text: danger[700],
      border: danger[100],
      solid: danger[500],
    },
    info: {
      bg: info[50],
      text: info[700],
      border: info[100],
      solid: info[500],
    },
  },
} as const;
