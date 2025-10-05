import React from 'react';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import Slide from '../../components/Slide/slide';
import "./home.css";
import "../../css/index.css";

class Home extends React.Component {
    render(){
       
        return(
            <div>
                <Header onPageChange = {this.props.onPageChange}/>
                <Slide/>
                <Footer onPageChange = {this.props.onPageChange}/>
                
            </div>
        );
    }
}

export default Home;