import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Slide from '../../components/Slide/slide';
import "./home.css";
import "../../css/index.css";

function Home() {
    return(
        <div>
            <Header/>
            <Slide/>
            <Footer/>
                
        </div>
    );
}

export default Home;