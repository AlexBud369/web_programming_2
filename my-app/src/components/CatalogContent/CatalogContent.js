// src/components/CatalogContent/CatalogContent.js
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography } from '../UI/Typography/Typography';
import CardSection from '../CardSection/cardSection';
import AsidePanel from '../AsidePanel/asidePanel';
import { media } from '../../styles/media';

const CatalogLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]} 0;
  max-width: 1400px;
  margin: 0 auto;

  ${media.tablet} {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing[4]} 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;

  ${media.tablet} {
    width: 100%;
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};

  &.error {
    color: ${({ theme }) => theme.colors.modalErrorText};
  }
`;

export default function CatalogContent() {
  const [filterOptions] = useState({
    categories: ['Tops & T-Shirts', 'Printed T-Shirts', 'Plain T-Shirts', 'Kurti', 'Boxers'],
    colors: [
      { name: 'purple', hex: 'purple' },
      { name: 'black', hex: 'black' },
      { name: 'white', hex: 'white' },
      { name: 'red', hex: 'red' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    dressStyles: ['All Styles', 'Classic', 'Casual', 'Formal', 'Sport'],
  });

  const [cardInfo, setCardInfo] = useState([]);
  const [filteredCardInfo, setFilteredCardInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    category: null,
    color: null,
    size: null,
    style: null,
    minPrice: 0,
    maxPrice: 250,
    search: '',
  });

  // Загрузка данных
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:3001/products')
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((item) => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        }));
        setCardInfo(normalized);
        setFilteredCardInfo(normalized);
      })
      .catch((err) => {
        console.error('Ошибка загрузки:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Фильтрация
  useEffect(() => {
    let filtered = [...cardInfo];

    if (activeFilters.category) {
      filtered = filtered.filter((item) => item.category === activeFilters.category);
    }
    if (activeFilters.color) {
      filtered = filtered.filter((item) => item.colors?.includes(activeFilters.color));
    }
    if (activeFilters.size) {
      filtered = filtered.filter((item) => item.sizes?.includes(activeFilters.size));
    }
    if (activeFilters.style && activeFilters.style !== 'All Styles') {
      filtered = filtered.filter((item) => item.style === activeFilters.style);
    }
    if (activeFilters.minPrice > 0 || activeFilters.maxPrice < 250) {
      filtered = filtered.filter(
        (item) =>
          !isNaN(item.price) &&
          item.price >= activeFilters.minPrice &&
          item.price <= activeFilters.maxPrice
      );
    }
    if (activeFilters.search) {
      const query = activeFilters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    setFilteredCardInfo(filtered);
  }, [activeFilters, cardInfo]);

  // Колбэки
  const handleCategoryChange = (category, checked) => {
    setActiveFilters((prev) => ({ ...prev, category: checked ? category : null }));
  };

  const handleColorChange = (color, checked) => {
    setActiveFilters((prev) => ({ ...prev, color: checked ? color : null }));
  };

  const handleSizeChange = (size) => {
    setActiveFilters((prev) => ({ ...prev, size: prev.size === size ? null : size }));
  };

  const handleStyleChange = (style) => {
    setActiveFilters((prev) => ({ ...prev, style }));
  };

  const handlePriceChange = (min, max) => {
    setActiveFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleSearchChange = (query) => {
    setActiveFilters((prev) => ({ ...prev, search: query }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      category: null,
      color: null,
      size: null,
      style: null,
      minPrice: 0,
      maxPrice: 250,
      search: '',
    });
  };

  const handleSortChange = (value) => {
    const sorted = [...filteredCardInfo];
    if (value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setFilteredCardInfo(sorted);
  };

  const cards = Array.isArray(filteredCardInfo) ? filteredCardInfo : [];

  if (loading) {
    return (
      <StatusMessage>
        <Typography variant="body">Loading products...</Typography>
      </StatusMessage>
    );
  }

  if (error) {
    return (
      <StatusMessage className="error">
        <Typography variant="body">Error: {error}</Typography>
      </StatusMessage>
    );
  }

  if (cards.length === 0) {
    return (
      <StatusMessage>
        <Typography variant="body">No products found.</Typography>
      </StatusMessage>
    );
  }

  return (
    <CatalogLayout>
      <AsidePanel
        filterOptions={filterOptions}
        onCategoryChange={handleCategoryChange}
        onColorChange={handleColorChange}
        onSizeChange={handleSizeChange}
        onStyleChange={handleStyleChange}
        onPriceChange={handlePriceChange}
        onSearchChange={handleSearchChange}
        onClearFilters={handleClearFilters}
        onSortChange={handleSortChange}
      />
      <MainContent>
        <CardSection
          cardInfo={cards}
          setIsModalOpen={setIsModalOpen}
          setSelectedItem={setSelectedItem}
        />
      </MainContent>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedItem?.name}</h2>
            <img
              src={selectedItem?.image}
              alt={selectedItem?.name}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px',
                margin: '1rem 0',
              }}
            />
            <p>
              <strong>Brand:</strong> {selectedItem?.brand}
            </p>
            <p>
              <strong>Price:</strong> ${selectedItem?.price}
            </p>
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#8A33FD',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </CatalogLayout>
  );
}