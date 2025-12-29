import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import CatalogContent from '../../components/CatalogContent/CatalogContent.js';
import "./catalog.css"

function Catalog() {
    return(
        <div>
            <Header/>
            <CatalogContent/>
            <Footer/>
        </div>
    );
}

export default Catalog;