import React from "react";

class AsidePanel extends React.Component {
  render() {
    const { categories, colors, sizes, dressStyles } = this.props.filterOptions || {};
    return (
        <main className="catalog-container">
            <aside className="filters-sidebar">
                <section className="filters-header">
                    <h2>Filter & Sort</h2>
                    <button className="clear-filters">Clear all</button>
                </section>

                <section className="filter-section">
                    <h3 className="filter-title">Sort By</h3>
                    <select id="sort-by" className="sort-select">
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
                            defaultValue="20"
                            className="price-slider"
                            id="price-range-min"
                        />
                        <input
                            type="range"
                            min="0"
                            max="250"
                            defaultValue="250"
                            className="price-slider"
                            id="price-range-max"
                        />
                        </div>
                        <div className="price-values">
                        <span>$<span id="min-price-value">20</span></span>
                        <span>$<span id="max-price-value">250</span></span>
                        </div>
                    </div>
                </section>

                <section className="filter-section">
                    <h3 className="filter-title">Colors</h3>
                    <div className="color-options" id="color-filter">
                        {colors.map((color, index) => (
                        <div
                            key={index}
                            className="color-option"
                            data-color={color.name}
                            style={{ backgroundColor: color.hex }}
                        ></div>
                        ))}
                    </div>
                </section>

                <section className="filter-section">
                    <h3 className="filter-title">Size</h3>
                    <div className="size-options" id="size-filter">
                        {sizes.map((size, index) => (
                        <button key={index} className="size-option" data-size={size}>
                            {size}
                        </button>
                        ))}
                    </div>
                </section>

                <section className="filter-section">
                    <h3 className="filter-title">Dress Style</h3>
                    <select className="style-select" id="style-filter">
                        {dressStyles.map((style, index) => (
                        <option key={index} value={style}>
                            {style}
                        </option>
                        ))}
                    </select>
                </section>
            </aside>
        </main>
    );
  }
}

export default AsidePanel;