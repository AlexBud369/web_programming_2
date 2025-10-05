import React from "react";
import Card from "../card/card";

class CardSection extends React.Component {
    render () {
        const { cardInfo } = this.props;
        return (
            <section class="products-main">
                <div class="products-grid" id="products-grid">
                    { cardInfo.map((card, index) => ( 
                        <Card key= {index} title={card.title} brand = {card.brand} price = {card.price}/>
                        )
                    )}
                </div>
            </section>
        );
    }
}

export default CardSection;