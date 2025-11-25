import {Link} from "react-router-dom";

function ErrorBanner() {
    return (
        <main className ="error-container">
            <div className ="error-content">
                <div className ="error-image-container">
                    <span className ="error-digit digit-4">4</span>
                    <span className ="error-digit digit-0">0</span>
                    <span className ="error-digit digit-4-rotated">4</span>
                </div>
                <h1 className ="error-title">Oops! Page not found</h1>
                <p className ="error-message">The page you are looking for might have been removed or temporarily unavailable.</p>
                <Link className ="back-home-btn"to="/home">Back to HomePage</Link>
            </div>
        </main>
    );
}

export default ErrorBanner;