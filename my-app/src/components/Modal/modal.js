// components/Modal/Modal.jsx
import styled, { keyframes } from 'styled-components';
import { Button } from '../UI/Button/Button';
import { Typography } from '../UI/Typography/Typography';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
  animation: ${fadeIn} 0.3s ease forwards;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

export default function Modal({ item, onClose }) {
  if (!item) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Typography variant="h2" $gutterBottom>
          {item.name}
        </Typography>
        <ModalImage src={item.image} alt={item.name} />
        <Typography variant="body" $gutterBottom>
          <strong>Brand:</strong> {item.brand}
        </Typography>
        <Typography variant="body" $gutterBottom>
          <strong>Price:</strong> ${item.price}
        </Typography>
        <Button variant="primary" onClick={onClose} size="medium">
          Close
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
}