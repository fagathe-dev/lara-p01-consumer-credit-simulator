/**
 * Global Styles
 * Minimal CSS reset + base font configuration + focus states
 */

import { createGlobalStyle } from "styled-components";
import { typography } from "./typography";
import { semanticColors } from "./colors";
import { radius } from "./radius";

export const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  /* Base Typography */
  body {
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.regular};
    line-height: ${typography.lineHeight.normal};
    color: ${semanticColors.text.primary};
    background-color: ${semanticColors.background.app};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.fontWeight.semibold};
    line-height: ${typography.lineHeight.tight};
  }

  /* Links */
  a {
    color: ${semanticColors.text.link};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* Keyboard Focus - Accessibility */
  :focus-visible {
    outline: 2px solid ${semanticColors.border.focus};
    outline-offset: 2px;
  }

  /* Form elements */
  input, textarea, select {
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.base};
  }

  /* Tabular figures for numbers */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Lists */
  ul, ol {
    list-style-position: inside;
  }

  /* Scrollbar (subtle) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${semanticColors.border.default};
    border-radius: ${radius.md};

    &:hover {
      background: ${semanticColors.border.strong};
    }
  }
`;
