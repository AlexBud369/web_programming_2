import styled from 'styled-components';
import { media } from '../../../styles/media';

export const Container = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  
  ${media.tablet} {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }
  
  ${media.laptop} {
    padding: 0 ${({ theme }) => theme.spacing[8]};
  }
  
  ${({ $fluid }) => $fluid && `
    max-width: 100%;
  `}
`;