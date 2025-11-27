import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import AsidePanel from '../../components/AsidePanel/asidePanel.js';
import AdminCardSection from '../../components/AdminCardSection/AdminCardSection.js';
import ActionButton from '../../components/ActionButton/ActionButton.js';
import UniversalModal from '../../components/Modal/modal.js';
import ProductForm from '../../components/ProductForm/ProductForm.js';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../Store/Slices/productsSlice.js';
import { removeFromCart } from '../../Store/Slices/cartSlice.js';
import "../Catalog/catalog.css";

const filterOptions = {
    categories: ['Tops & T-Shirts', 'Printed T-Shirts', 'Plain T-Shirts', 'Kurti', 'Boxers', 'Joggers'],
    colors: [{ name: 'purple', hex: 'purple' }, { name: 'black', hex: 'black' }, { name: 'white', hex: 'white' }, { name: 'red', hex: 'red' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    dressStyles: ['All Styles', 'Classic', 'Casual', 'Formal', 'Sport', 'Elegant'],
};

function Admin() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const { items, loading, error, filters } = useSelector(state => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const getFilteredProducts = () => {
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

    const filteredProducts = getFilteredProducts();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSave = async (formData) => {
        try {
            if (editingProduct) {
                await dispatch(updateProduct({ ...editingProduct, ...formData })).unwrap();
            } else {
                await dispatch(addProduct({ 
                    ...formData, 
                    id: Date.now()
                })).unwrap();
            }
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirm_delete'))) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                dispatch(removeFromCart(id));
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    return (
        <>
            <Header />
            <main className="catalog-container" style={{ paddingTop: '100px' }}>
                <AsidePanel filterOptions={filterOptions} />

                <section className="products-main">
                    <div className="products-header">
                        <h1>{t('admin.title')}</h1>
                        <ActionButton 
                            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
                            color="success"
                        >
                            {t('admin.add_product')}
                        </ActionButton>
                    </div>

                    <p>{t('admin.total')}: {filteredProducts.length}</p>

                    {loading && <div className="status-message loading">{t('common.loading')}</div>}
                    {error && <div className="status-message error">{error}</div>}

                    <AdminCardSection
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </section>
            </main>

            <Footer />

            <UniversalModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? t('admin.edit_product') : t('admin.add_product')}
                content={
                    <ProductForm
                        product={editingProduct}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                }
            />
        </>
    );
}

export default Admin;