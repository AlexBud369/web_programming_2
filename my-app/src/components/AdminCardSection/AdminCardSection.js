import AdminCard from '../AdminCard/AdminCard.js';

function AdminCardSection({ products, onEdit, onDelete }) {

     const safeProducts = products || [];
    return (
        <div className="products-grid">
            {products.map(product => (
                <AdminCard
                    key={product.id}
                    product={product}
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product.id)}
                />
            ))}
        </div>
    );
}

export default AdminCardSection;