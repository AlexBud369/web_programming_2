// src/components/ErrorBanner/ErrorBanner.js
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { Button } from '../UI/Button/Button';
import { Typography } from '../UI/Typography/Typography';
import { Container as UIContainer } from '../UI/Container/Container';

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  text-align: center;
  background: ${({ theme }) => theme.colors.background};
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorDigits = styled.div`
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.secondary};
  letter-spacing: -0.05em;
  
  span {
    display: inline-block;
    margin: 0 ${({ theme }) => theme.spacing[2]};
  }
  
  .rotated {
    transform: rotate(28deg);
  }
`;

export default function ErrorBanner() {
  return (
    <ErrorContainer>
      <UIContainer>
        <ErrorDigits>
          <span>4</span>
          <span>0</span>
          <span className="rotated">4</span>
        </ErrorDigits>
        <Typography variant="h2" $gutterBottom>
          Oops! Page not found
        </Typography>
        <Typography variant="body" $gutterBottom>
          The page you are looking for might have been removed or temporarily unavailable.
        </Typography>
        <Button as={Link} to="/home" variant="primary" size="medium">
          Back to Home
        </Button>
      </UIContainer>
    </ErrorContainer>
  );
}