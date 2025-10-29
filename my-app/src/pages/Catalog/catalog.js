import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import Container from '../../components/Container/container';
import "./catalog.css"

function Catalog({ cart, addToCart, removeFromCart }) {
    return(
        <div>
            <Header/>
            <Container/>
            <Footer/>
        </div>
    );
}

export default Catalog;