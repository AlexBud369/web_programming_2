// src/components/Card/ProductCard.js
import styled from 'styled-components';
import { Button } from '../UI/Button/Button';
import { Typography } from '../UI/Typography/Typography';
import { Card as UICard } from '../UI/Card/Card';

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const QuickViewButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

export default function ProductCard({ id, name, brand, price, image, setIsModalOpen, setSelectedItem }) {
  const handleOpenModal = () => {
    setSelectedItem({ id, name, brand, price, image });
    setIsModalOpen(true);
  };

  return (
    <UICard $interactive>
      <ProductImage src={image} alt={name} loading="lazy" />
      <ProductInfo>
        <Typography variant="h3" $gutterBottom>
          {name}
        </Typography>
        <Typography variant="caption" $gutterBottom>
          {brand}
        </Typography>
        <Typography variant="body" $gutterBottom>
          ${price}
        </Typography>
        <QuickViewButton
          variant="outline"
          size="small"
          onClick={handleOpenModal}
        >
          Quick View
        </QuickViewButton>
      </ProductInfo>
    </UICard>
  );
}

