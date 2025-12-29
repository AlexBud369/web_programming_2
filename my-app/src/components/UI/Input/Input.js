import styled, { css } from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: ${({ theme }) => theme.colors.inputBg || 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}20;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ $error, theme }) => $error && css`
    border-color: ${theme.colors.modalErrorText};
    
    &:focus {
      border-color: ${theme.colors.modalErrorText};
      box-shadow: 0 0 0 3px ${theme.colors.modalErrorText}20;
    }
  `}
  
  ${({ $success, theme }) => $success && css`
    border-color: ${theme.colors.modalSuccessText};
    
    &:focus {
      border-color: ${theme.colors.modalSuccessText};
      box-shadow: 0 0 0 3px ${theme.colors.modalSuccessText}20;
    }
  `}
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text}80;
  }
`;