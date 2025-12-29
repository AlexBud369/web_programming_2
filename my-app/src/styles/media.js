// styles/media.js
import { css } from 'styled-components';

const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1920px',
};

export const media = {
  tablet: (...args) => css`
    @media (max-width: ${breakpoints.tablet}) {
      ${css(...args)}
    }
  `,
  laptop: (...args) => css`
    @media (max-width: ${breakpoints.laptop}) {
      ${css(...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: ${breakpoints.mobile}) {
      ${css(...args)}
    }
  `,
};