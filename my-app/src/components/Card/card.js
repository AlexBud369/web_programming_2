import ActionButton from '../ActionButton/ActionButton';

function Card({ id, name, brand, price, image, setIsModalOpen, setSelectedItem }) {
    const handleOpenModal = (e) => {
        e.stopPropagation();
        setSelectedItem({ id, name, brand, price, image });
        setIsModalOpen(true);
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, brand, price, image, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

  return (
    <div className="product-card">
        <div className="product-image-container">
            <img src={image} alt={name} className="product-image" />
        </div>
        <div className="product-info">
            <h3 className="product-name">{name}</h3>
            <p className="product-brand">{brand}</p>
            <p className="product-price">${price}</p>
        </div>
       <div className="product-card-actions">
            <button className="quick-view" onClick={handleOpenModal}>Quick View</button>
            <ActionButton onClick={handleAddToCart} size="small" color="secondary">
                Add to Cart
            </ActionButton>
        </div>
    </div>
  );
}

export default Card;