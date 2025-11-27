import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Store/Slices/cartSlice.js';
import ActionButton from '../ActionButton/ActionButton';

function Card({ id, name, brand, price, image, setIsModalOpen, setSelectedItem }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        setSelectedItem({ id, name, brand, price, image });
        setIsModalOpen(true);
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ id, name, brand, price, image }));
        alert(t('catalog.added_to_cart') || 'Added to cart!');
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={image} alt={name} className="product-image" />
                
                <div className="quick-view-overlay">
                    <button 
                        className="quick-view-btn"
                        onClick={handleOpenModal}
                    >
                        {t('catalog.quick_view') || 'Quick View'}
                    </button>
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-brand">{brand}</p>
                <p className="product-price">${price}</p>
            </div>

            <div className="product-card-actions">
                <ActionButton 
                    onClick={handleAddToCart} 
                    size="small" 
                    color="secondary" 
                    fullWidth
                >
                    {t('catalog.add_to_cart') || 'Add to Cart'}
                </ActionButton>
            </div>
        </div>
    );
}

export default Card;