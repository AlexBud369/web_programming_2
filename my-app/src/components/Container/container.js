import React, { useState, useEffect } from "react";
import CardSection from "../CardSection/cardSection.js";
import AsidePanel from "../AsidePanel/asidePanel.js";
import Modal from "../Modal/modal";

function Container() {
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
        search: "",
    });

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch('http://localhost:3001/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                setCardInfo(data);
                setFilteredCardInfo(data);
            })
            .catch(err => {
                console.error('Ошибка загрузки:', err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const applyFilters = () => {
        let filtered = [...cardInfo];

        if (activeFilters.category) {
            filtered = filtered.filter(item => item.category === activeFilters.category);
        }
        if (activeFilters.color) {
            filtered = filtered.filter(item => item.colors.includes(activeFilters.color));
        }
        if (activeFilters.size) {
            filtered = filtered.filter(item => item.sizes.includes(activeFilters.size));
        }
        if (activeFilters.style && activeFilters.style !== "All Styles") {
            filtered = filtered.filter(item => item.style === activeFilters.style);
        }
        if (activeFilters.minPrice > 0 || activeFilters.maxPrice < 250) {
            filtered = filtered.filter(
                item => item.price >= activeFilters.minPrice && item.price <= activeFilters.maxPrice
            );
        }
        if (activeFilters.search) {
            const query = activeFilters.search.toLowerCase();
            filtered = filtered.filter(
                item => 
                    item.name.toLowerCase().includes(query) || 
                    (item.description && item.description.toLowerCase().includes(query))
            );
        }

        setFilteredCardInfo(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [activeFilters, cardInfo]);

    const handleCategoryChange = (category, checked) => {
        setActiveFilters(prev => ({ ...prev, category: checked ? category : null }));
    };

    const handleColorChange = (color, checked) => {
        setActiveFilters(prev => ({ ...prev, color: checked ? color : null }));
    };

    const handleSizeChange = (size) => {
        setActiveFilters(prev => ({ ...prev, size: prev.size === size ? null : size }));
    };

    const handleStyleChange = (style) => {
        setActiveFilters(prev => ({ ...prev, style }));
    };

    const handlePriceChange = (min, max) => {
        setActiveFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    };

    const handleSearchChange = (query) => {
        setActiveFilters(prev => ({ ...prev, search: query }));
    };

    const handleClearFilters = () => {
        setActiveFilters({
            category: null,
            color: null,
            size: null,
            style: null,
            minPrice: 0,
            maxPrice: 250,
            search: "",
        });
    };

    const handleSortChange = (value) => {
        const sorted = [...filteredCardInfo];
        if (value === 'price-asc') {
            sorted.sort((a, b) => a.price - b.price);
        }
        if (value === 'price-desc') {
            sorted.sort((a, b) => b.price - a.price);
        }
        if (value === 'name-asc') {
             sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (value === 'name-desc') {
            sorted.sort((a, b) => b.name.localeCompare(a.name));
        }
        if (value === 'rating-desc') {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        setFilteredCardInfo(sorted);
    };

    return (
        <main className="catalog-container">
            <AsidePanel
                filterOptions={filterOptions}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                onColorChange={handleColorChange}
                onSizeChange={handleSizeChange}
                onStyleChange={handleStyleChange}
                onPriceChange={handlePriceChange}
                onSearchChange={handleSearchChange}
                onClearFilters={handleClearFilters}
            />

            {loading && (
                <div className="status-message loading">
                    Загрузка товаров...
                </div>
            )}

            {error && (
                <div className="status-message error">
                    Ошибка: {error}
                </div>
            )}

            {!loading && !error && filteredCardInfo.length === 0 && (
                <div className="status-message empty">
                    Товары не найдены
                </div>
            )}

            {!loading && !error && filteredCardInfo.length > 0 && (
                <CardSection
                    cardInfo={filteredCardInfo}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedItem={setSelectedItem}
                />
            )}

            {isModalOpen && (
                <Modal
                    item={selectedItem}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </main>
    );
}

export default Container;