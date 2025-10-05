import React from 'react';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import Container from '../../components/Container/container';
import "./catalog.css"

class Catalog extends React.Component {
    render(){
       
        return(
            <div>
                <Header onPageChange = {this.props.onPageChange}/>
                <Container/>
                <Footer onPageChange = {this.props.onPageChange}/>
            </div>
        );
    }
}

export default Catalog;