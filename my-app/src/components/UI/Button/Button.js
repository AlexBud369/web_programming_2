import styled, { css } from 'styled-components';

const buttonVariants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accentHover};
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.accent};
    border: 2px solid ${({ theme }) => theme.colors.accent};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.modalErrorText};
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: #b71c1c;
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.accent};
    }
  `,
  text: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.bgHover};
    }
  `
};

const buttonSizes = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.fontSizes.base};
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `
};

export const Button = styled.button.attrs(({ type = 'button' }) => ({
  type,
}))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;
  white-space: nowrap;
  
  /* Варианты */
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  
  /* Размеры */
  ${({ size = 'medium' }) => buttonSizes[size]}
  
  /* Состояния */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  /* Полная ширина */
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  /* Иконка */
  svg {
    width: 1.25em;
    height: 1.25em;
  }
`;