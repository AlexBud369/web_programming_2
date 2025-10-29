import {Link} from 'react-router-dom';
import "./header.css";
import logoImage from "../../images/Logo.png";


function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <a href="index.html" className="logo">
                    <img src={logoImage} alt="Euphoria Logo"></img>
                </a>
                <nav className="main-nav">
                    <ul>
                        <li className="auth-only"><Link to="/home">Home</Link></li>
                        <li className="auth-only"> <Link to="/catalog">Catalog</Link></li>
                    </ul>
                </nav>
                <div className="header-controls">
                    <div className="language-selector">
                        <button className="language-toggle">
                            <span className="current-language">English</span>
                            <span className="drop-icon">▼</span>
                        </button>
                        <div className="language-dropdown">
                            <button data-lang="en">English</button>
                            <button data-lang="ru">Русский</button>
                        </div>
                    </div>
                    <div className="custom-toggle">
                        <input type="checkbox" id="theme-toggle" className="toggle-input"></input>
                        <label className="toggle-label">
                            <span className="toggle-track">
                                <span className="toggle-knob"></span>
                            </span>
                        </label>
                    </div>
                    <button className="burger-menu">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>
            </div>
        </header>)
}

export default Header;