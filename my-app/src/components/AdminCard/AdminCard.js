import { useTranslation } from 'react-i18next';
import ActionButton from '../ActionButton/ActionButton.js';

function AdminCard({ product, onEdit, onDelete }) {
    const { t } = useTranslation();

    if (!product) {
        return null; 
    }

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(product);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(product.id, e);
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
            </div>

            <div className="product-card-actions">
                <ActionButton 
                    type="button" 
                    onClick={handleEdit} 
                    color="primary" 
                    size="small" 
                    fullWidth
                >
                    {t('admin.edit')}
                </ActionButton>
                <ActionButton 
                    type="button" 
                    onClick={handleDelete} 
                    color="error" 
                    size="small" 
                    fullWidth 
                    sx={{ mt: 1 }}
                >
                    {t('admin.delete')}
                </ActionButton>
            </div>
        </div>
    );
}

export default AdminCard;