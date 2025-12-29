import React, { useState } from "react";
import styled from 'styled-components';
import { Button } from '../UI/Button/Button';
import { Input } from '../UI/Input/Input';
import { Typography } from '../UI/Typography/Typography';
import { media } from '../../styles/media';

const FiltersSidebar = styled.aside`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  width: 300px;
  height: fit-content;
  position: sticky;
  top: 120px;
  
  ${media.tablet} {
    width: 100%;
    position: static;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const FiltersHeader = styled.section`
  display: flex; 
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
`;

const FilterTitle = styled(Typography).attrs({ variant: 'h3', as: 'h3' })`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.secondary};
`;

const FilterSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ClearFiltersButton = styled(Button).attrs({ variant: 'outline' })`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
`;

const SortSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}20;
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  
  &:hover {
    label {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const FilterCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
  
  &:checked {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FilterLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};
  flex: 1;
`;

const PriceRangeContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const RangeContainer = styled.div`
  position: relative;
  height: 20px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RangeTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transform: translateY(-50%);
`;

const RangeTrackFill = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ min }) => `${min}%`};
  right: ${({ max }) => `${100 - max}%`};
  height: 4px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transform: translateY(-50%);
`;

const PriceSlider = styled.input.attrs({ type: 'range' })`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 20px;
  margin: 0;
  transform: translateY(-50%);
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.base};
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.base};
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const PriceValues = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const ColorOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ColorOptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base};
  
  &:hover {
    transform: translateY(-2px);
  }
  
  input {
    display: none;
    
    &:checked + .color-option {
      transform: scale(1.1);
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary},
                  0 0 0 4px ${({ theme }) => theme.colors.accent};
    }
  }
`;

const ColorOption = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: block;
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  transition: all ${({ theme }) => theme.transitions.base};
  background-color: ${({ color }) => color};
  
  ${media.mobile} {
    width: 24px;
    height: 24px;
  }
`;

const ColorName = styled.span`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SizeOption = styled(Button).attrs({ variant: 'outline' })`
  min-width: 40px;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  ${({ $active, theme }) => $active && `
    background-color: ${theme.colors.accent};
    color: ${theme.colors.primary};
    border-color: ${theme.colors.accent};
  `}
`;

const StyleSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}20;
  }
`;

function AsidePanel({ 
  filterOptions, 
  onCategoryChange, 
  onSortChange, 
  onColorChange, 
  onSizeChange, 
  onStyleChange, 
  onPriceChange, 
  onSearchChange, 
  onClearFilters 
}) {
  const { categories, colors, sizes, dressStyles } = filterOptions || {};
  const [minPrice, setMinPrice] = useState(20); 
  const [maxPrice, setMaxPrice] = useState(250);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSize, setActiveSize] = useState(null);

  const handlePriceChange = () => {
    onPriceChange(minPrice, maxPrice);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSizeClick = (size) => {
    setActiveSize(activeSize === size ? null : size);
    onSizeChange(activeSize === size ? null : size);
  };

  const handleColorChangeWrapper = (color, checked) => {
    onColorChange(color, checked);
  };

  return (
    <FiltersSidebar>
      <FiltersHeader>
        <Typography variant="h2" as="h2">
          Filter & Sort
        </Typography>
        <ClearFiltersButton 
          onClick={onClearFilters} 
          title="Reset all filters"
        >
          Clear all
        </ClearFiltersButton>
      </FiltersHeader>

      <FilterSection>
        <FilterTitle>Sort By</FilterTitle>
        <SortSelect id="sort-by" onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="rating-desc">Rating: High to Low</option>
        </SortSelect>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Search</FilterTitle>
        <SearchInput
          type="text"
          id="search-input"
          placeholder="Search by name, description..."
          value={searchQuery}
          onChange={handleSearchChange}
          title="Search products by name or description"
        />
      </FilterSection>

      <FilterSection>
        <FilterTitle>Category</FilterTitle>
        <FilterList id="category-filter">
          {categories && categories.map((category, index) => (
            <FilterListItem key={index}>
              <FilterCheckbox
                id={`category-${index}`}
                name="category"
                value={category}
                onChange={(e) => onCategoryChange(category, e.target.checked)}
              />
              <FilterLabel htmlFor={`category-${index}`}>
                {category}
              </FilterLabel>
            </FilterListItem>
          ))}
        </FilterList>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Price</FilterTitle>
        <PriceRangeContainer>
          <RangeContainer>
            <RangeTrack />
            <RangeTrackFill 
              min={(minPrice / 250) * 100} 
              max={(maxPrice / 250) * 100} 
            />
            <PriceSlider
              min="0"
              max="250"
              value={minPrice}
              id="price-range-min"
              onChange={(e) => {
                const newMin = Number(e.target.value);
                setMinPrice(newMin);
                if (newMin > maxPrice) setMaxPrice(newMin);
                handlePriceChange();
              }}
              title="Set minimum price"
            />
            <PriceSlider
              min="0"
              max="250"
              value={maxPrice}
              id="price-range-max"
              onChange={(e) => {
                const newMax = Number(e.target.value);
                setMaxPrice(newMax);
                if (newMax < minPrice) setMinPrice(newMax);
                handlePriceChange();
              }}
              title="Set maximum price"
            />
          </RangeContainer>
          <PriceValues>
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </PriceValues>
        </PriceRangeContainer>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Colors</FilterTitle>
        <ColorOptions id="color-filter">
          {colors && colors.map((color, index) => (
            <ColorOptionLabel key={index}>
              <input
                type="checkbox"
                value={color.name}
                onChange={(e) => handleColorChangeWrapper(color.name, e.target.checked)}
                title={`Filter by ${color.name}`}
              />
              <ColorOption 
                className="color-option" 
                color={color.hex}
              />
              <ColorName>{color.name}</ColorName>
            </ColorOptionLabel>
          ))}
        </ColorOptions>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Size</FilterTitle>
        <SizeOptions id="size-filter">
          {sizes && sizes.map((size, index) => (
            <SizeOption
              key={index}
              $active={activeSize === size}
              onClick={() => handleSizeClick(size)}
              title={`Filter by size ${size}`}
            >
              {size}
            </SizeOption>
          ))}
        </SizeOptions>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Dress Style</FilterTitle>
        <StyleSelect
          id="style-filter"
          onChange={(e) => onStyleChange(e.target.value)}
        >
          <option value="">All Styles</option>
          {dressStyles && dressStyles.map((style, index) => (
            <option key={index} value={style}>
              {style}
            </option>
          ))}
        </StyleSelect>
      </FilterSection>
    </FiltersSidebar>
  );
}

export default AsidePanel;