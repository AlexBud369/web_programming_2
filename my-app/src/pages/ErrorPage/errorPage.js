import "./errorPageStyles.css";
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner";

function ErrorPage() {
    return (
         <div>
            <Header/>
            <ErrorBanner/>
            <Footer/>
        </div>
    );
}

export default ErrorPage;