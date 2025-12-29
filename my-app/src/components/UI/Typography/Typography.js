import styled, { css } from 'styled-components';

const typographyVariants = {
  h1: css`
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  `,
  h2: css`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: ${({ theme }) => theme.spacing[5]};
  `,
  h3: css`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  `,
  body: css`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-family: ${({ theme }) => theme.fonts.main};
    font-weight: 400;
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  `,
  caption: css`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-family: ${({ theme }) => theme.fonts.main};
    font-weight: 400;
    line-height: 1.5;
    opacity: 0.8;
  `,
  button: css`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-family: ${({ theme }) => theme.fonts.main};
    font-weight: 500;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `
};

export const Typography = styled.p.attrs(({ as = 'p', variant = 'body' }) => ({
  as: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant) ? variant : as,
}))`
  ${({ variant }) => typographyVariants[variant] || typographyVariants.body};
  
  color: ${({ theme, $color }) => 
    $color ? (theme.colors[$color] || $color) : 'inherit'};
  
  text-align: ${({ $align }) => $align || 'left'};
  
  ${({ $gutterBottom }) => $gutterBottom && `
    margin-bottom: ${$gutterBottom};
  `}
  
  ${({ $noWrap }) => $noWrap && `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;