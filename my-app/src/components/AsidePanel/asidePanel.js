import React, { useState } from "react";

function AsidePanel({ filterOptions, onCategoryChange, onSortChange, onColorChange, onSizeChange, onStyleChange, onPriceChange, onSearchChange, onClearFilters }) {
    const { categories, colors, sizes, dressStyles } = filterOptions || {};
    const [minPrice, setMinPrice] = useState(20); 
    const [maxPrice, setMaxPrice] = useState(250);
    const [searchQuery, setSearchQuery] = useState(""); 

    const handlePriceChange = () => {
        onPriceChange(minPrice, maxPrice);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        onSearchChange(e.target.value);
    };

    return (
        <aside className="filters-sidebar">
            <section className="filters-header">
                <h2>Filter & Sort</h2>
                <button className="clear-filters" title="Reset all filters" onClick={onClearFilters}>
                Clear all
                </button>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Sort By</h3>
                <select id="sort-by" className="sort-select" onChange={(e) => onSortChange(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Rating: High to Low</option>
                </select>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Search</h3>
                <input
                type="text"
                id="search-input"
                className="search-input"
                placeholder="Search by name, description..."
                value={searchQuery}
                onChange={handleSearchChange}
                title="Search products by name or description"
                />
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Category</h3>
                <ul className="filter-list" id="category-filter">
                {categories.map((category, index) => (
                    <li key={index}>
                    <input
                        type="checkbox"
                        id={`category-${index}`}
                        name="category"
                        value={category}
                        onChange={(e) => onCategoryChange(category, e.target.checked)}
                    />
                    <label htmlFor={`category-${index}`}>{category}</label>
                    </li>
                ))}
                </ul>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Price</h3>
                <div className="price-range">
                <div className="range-container">
                    <div className="range-track"></div>
                    <input
                    type="range"
                    min="0"
                    max="250"
                    value={minPrice}
                    className="price-slider"
                    id="price-range-min"
                    onChange={(e) => {
                        setMinPrice(Number(e.target.value));
                        handlePriceChange();
                    }}
                    title="Set minimum price"
                    />
                    <input
                    type="range"
                    min="0"
                    max="250"
                    value={maxPrice}
                    className="price-slider"
                    id="price-range-max"
                    onChange={(e) => {
                        setMaxPrice(Number(e.target.value));
                        handlePriceChange();
                    }}
                    title="Set maximum price"
                    />
                </div>
                <div className="price-values">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                </div>
                </div>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Colors</h3>
                <div className="color-options" id="color-filter">
                {colors.map((color, index) => (
                    <label key={index} className="color-option-label">
                    <input
                        type="checkbox"
                        value={color.name}
                        onChange={(e) => onColorChange(color.name, e.target.checked)}
                        title={`Filter by ${color.name}`}
                    />
                    <span
                        className="color-option"
                        style={{ backgroundColor: color.hex }}
                    ></span>
                    {color.name}
                    </label>
                ))}
                </div>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Size</h3>
                <div className="size-options" id="size-filter">
                {sizes.map((size, index) => (
                    <button
                    key={index}
                    className="size-option"
                    onClick={() => onSizeChange(size)}
                    title={`Filter by size ${size}`}
                    >
                    {size}
                    </button>
                ))}
                </div>
            </section>

            <section className="filter-section">
                <h3 className="filter-title">Dress Style</h3>
                <select
                className="style-select"
                id="style-filter"
                onChange={(e) => onStyleChange(e.target.value)}
                >
                <option value="">All Styles</option>
                {dressStyles.map((style, index) => (
                    <option key={index} value={style}>
                    {style}
                    </option>
                ))}
                </select>
            </section>
        </aside>
  );
}

export default AsidePanel;