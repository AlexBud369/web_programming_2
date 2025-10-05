import React from 'react';
import "./header.css";
import logoImage from "../../images/Logo.png";


class Header extends React.Component {
    handleLinkClick = (page, event) => {
        event.preventDefault();
        this.props.onPageChange(page);
    }

    render() {
        return (
        <header className="header">
            <div className="header-container">
                <a href="index.html" className="logo">
                    <img src={logoImage} alt="Euphoria Logo"></img>
                </a>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/" onClick = {(e) => this.handleLinkClick('home', e)}>Home</a></li>
                        <li><a href="/" onClick = {(e) => this.handleLinkClick('catalog', e)}>Catalog</a></li>
                        <li className="auth-only"><a href="/" className="account-link">Account</a></li>
                        <li className="auth-only"><a href="/" className="cart-link">Cart</a></li>
                        <li className="admin-only"><a href="/" className="admin-link">Admin Panel</a></li>
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
}

export default Header;