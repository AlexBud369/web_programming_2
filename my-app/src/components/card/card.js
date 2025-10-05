import React from "react";
import productImage from "../../images/catalog_card1.png"

class Card extends React.Component {
    handleLinkClick = (page, event) => {
        event.preventDefault();
        this.props.onPageChange(page);
    }

    render () {
        const { title, brand, price } = this.props;
        return (
            <div className="product-card">
                <div className="product-image-container">
                    <img src={productImage} alt="Product Image" className="product-image"/> 
                </div>
                <div className="product-info">
                    <h3 className="product-name">{title}</h3>
                    <p className="product-brand">{brand}</p>
                    <p className="product-price">{price}</p>
                </div>
            </div>
        );
    }
}

export default Card;