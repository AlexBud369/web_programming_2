import Card from "../Card/card";

function CardSection({ cardInfo, setIsModalOpen, setSelectedItem }) {
    return (
        <section className="products-main">
            <div className="products-grid">
                {cardInfo.map((card) => (
                    <Card
                        key={card.id}
                        {...card}
                        setIsModalOpen={setIsModalOpen}
                        setSelectedItem={setSelectedItem}
                    />
                ))}
            </div>
        </section>
    );
}

export default CardSection;