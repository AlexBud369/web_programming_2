import styled, { css } from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  transition: all ${({ theme }) => theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  ${({ $interactive }) => $interactive && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(-2px);
    }
  `}
  
  ${({ $elevated, theme }) => $elevated && css`
    box-shadow: ${theme.shadows.lg};
    
    &:hover {
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
  `}
`;