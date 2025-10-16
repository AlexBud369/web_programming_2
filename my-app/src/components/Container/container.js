import React from "react";
import CardSection from "../cardSection/cardSection";
import AsidePanel from "../AsidePanel/asidePanel";

class Container extends React.Component {
    state = {
        filterOptions: {
            categories: [
                'Tops & T-Shirts',
                'Printed T-Shirts',
                'Plain T-Shirts',
                'Kurti',
                'Boxers',
            ],
            colors: [
                { name: 'purple', hex: 'purple' },
                { name: 'black', hex: 'black' },
                { name: 'white', hex: 'white' },
                { name: 'red', hex: 'red' },
            ],
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            dressStyles: ['All Styles', 'Classic', 'Casual', 'Formal', 'Sport'],
        },
    };

    render () {
         const { filterOptions } = this.state;
         const cardInfo = [
            {title: "Hawaiian Shirts", brand: "Dress up in summer vibe", price: "50"},
            {title: "Printed T-Shirt", brand: "New Designs Every Week", price: "45"},
            {title: "Cargo Joggers", brand: "Move with style & comfort", price: "65"}
        ];
        return (
             <main className="catalog-container">
                <AsidePanel filterOptions = {filterOptions} />
                <CardSection cardInfo = {cardInfo}/>
             </main>
        );
    }
}

export default Container;