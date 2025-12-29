// src/components/CardSection/cardSection.js
import styled from 'styled-components';
import ProductCard from '../Card/ProductCard';
import { media } from '../../styles/media';

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]} 0;

  /* На планшетах и мобильных — ТОЛЬКО ОДНА КОЛОНКА */
  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export default function CardSection({ cardInfo, setIsModalOpen, setSelectedItem }) {
  return (
    <ProductsGrid>
      {cardInfo?.map((card) => (
        <ProductCard
          key={card.id}
          {...card}
          setIsModalOpen={setIsModalOpen}
          setSelectedItem={setSelectedItem}
        />
      ))}
    </ProductsGrid>
  );
}