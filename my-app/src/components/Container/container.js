import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../Store/Slices/productsSlice.js';
import CardSection from "../CardSection/cardSection.js";
import AsidePanel from "../AsidePanel/asidePanel.js";
import UniversalModal from "../Modal/modal.js";

function Container() {
    const dispatch = useDispatch();
    const { items, loading, error, filters } = useSelector(state => state.products);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const filterOptions = {
        categories: ['Tops & T-Shirts', 'Printed T-Shirts', 'Plain T-Shirts', 'Kurti', 'Boxers', 'Joggers'],
        colors: [{ name: 'purple', hex: 'purple' }, { name: 'black', hex: 'black' }, { name: 'white', hex: 'white' }, { name: 'red', hex: 'red' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        dressStyles: ['All Styles', 'Classic', 'Casual', 'Formal', 'Sport', 'Elegant'],
    };

    const getFilteredItems = () => {
        if (!items || !Array.isArray(items)) return [];
        
        let filtered = [...items];
        const { category, color, size, style, minPrice, maxPrice, search, sort } = filters;

        if (search) {
            filtered = filtered.filter(product => 
                product.name?.toLowerCase().includes(search.toLowerCase()) ||
                product.description?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        
        if (color) {
            filtered = filtered.filter(p => p.colors?.includes(color));
        }
        
        if (size) {
            filtered = filtered.filter(p => p.sizes?.includes(size));
        }
        
        if (style && style !== 'All Styles') {
            filtered = filtered.filter(p => p.style === style);
        }
        
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

        filtered.sort((a, b) => {
            switch (sort) {
                case 'price-asc': 
                    return a.price - b.price;
                case 'price-desc': 
                    return b.price - a.price;
                case 'name-asc': 
                    return (a.name || '').localeCompare(b.name || '');
                case 'name-desc': 
                    return (b.name || '').localeCompare(a.name || '');
                default: return 0;
            }
        });

        return filtered;
    };

    const filteredItems = getFilteredItems();

    useEffect(() => {
        dispatch(fetchProducts()); 
    }, [dispatch]);

    return (
        <main className="catalog-container">
            <AsidePanel filterOptions={filterOptions} />

            {loading && <div className="status-message loading">Загрузка товаров...</div>}
            {error && <div className="status-message error">Ошибка: {error}</div>}
            {!loading && !error && filteredItems.length === 0 && <div>Товары не найдены</div>}

            {filteredItems.length > 0 && (
                <CardSection
                    cardInfo={filteredItems}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedItem={setSelectedItem}
                />
            )}

            {isModalOpen && (
                <UniversalModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={selectedItem?.name}
                    image={selectedItem?.image}
                    content={
                        <>
                            <p><strong>Brand:</strong> {selectedItem?.brand}</p>
                            <p><strong>Price:</strong> ${selectedItem?.price}</p>
                        </>
                    }
                />
            )}
        </main>
    );
}

export default Container;