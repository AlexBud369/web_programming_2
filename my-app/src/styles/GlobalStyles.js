import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Подключение шрифтов */
  @font-face {
    font-display: swap;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: local('Montserrat Regular'), local('Montserrat-Regular'),
         url('/fonts/montserrat-v29-latin-regular.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 800;
    src: local('Montserrat ExtraBold'), local('Montserrat-ExtraBold'),
         url('/fonts/montserrat-v29-latin-800.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Core Sans C';
    font-style: normal;
    font-weight: 500;
    src: url('/fonts/CoreSansC-55Medium.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Core Sans C';
    font-style: normal;
    font-weight: 600;
    src: url('/fonts/CoreSansC-65Bold.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Core Sans C';
    font-style: normal;
    font-weight: 800;
    src: url('/fonts/CoreSansC-85Heavy.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    src: local('Lato Light'), local('Lato-Light'),
         url('/fonts/lato-v24-latin-300.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'),
         url('/fonts/lato-v24-latin-regular.woff2') format('woff2');
  }
  
  @font-face {
    font-display: swap;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    src: local('Lato Bold'), local('Lato-Bold'),
         url('/fonts/lato-v24-latin-700.woff2') format('woff2');
  }

  /* Сброс и базовые стили */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export default GlobalStyles;