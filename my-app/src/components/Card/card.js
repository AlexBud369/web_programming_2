function Card({ id, name, brand, price, image, setIsModalOpen, setSelectedItem }) {
    const handleOpenModal = (e) => {
        e.stopPropagation(); 
        setSelectedItem({ id, name, brand, price, image });
        setIsModalOpen(true);
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
            <button className="quick-view" onClick={handleOpenModal}>
                Quick View
            </button>
        </div>
    );
}

export default Card;