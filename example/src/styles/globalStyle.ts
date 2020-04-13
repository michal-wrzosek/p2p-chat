import { createGlobalStyle } from 'styled-components';

import { normalizeCss } from './normalizeCss';

export const GlobalStyle = createGlobalStyle`
  ${normalizeCss};

  html, body {
    font-family: Lucida Console, Courier, monospace;
    color: black;
    font-size: 10px;
  }

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
