import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react'; 
import "./header.css";
import logoImage from "../../images/Logo.png";

function Header() {
    const { t, i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setDropdownOpen(false); 
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    return (
        <header className="header">
            <div className="header-container">
                <a href="/" className="logo">
                <img src={logoImage} alt="Euphoria Logo" />
                </a>
                <nav className="main-nav">
                <ul>
                    <li><Link to="/home">{t('header.home')}</Link></li>
                    <li><Link to="/catalog">{t('header.catalog')}</Link></li>
                    <li><Link to="/cart">{t('header.cart')}</Link></li>
                    <li><Link to="/admin">{t('header.admin')}</Link></li>
                </ul>
                </nav>
                <div className="header-controls">
                <div className="language-selector" ref={dropdownRef}>
                    <button className="language-toggle" onClick={toggleDropdown}>
                        <span className="current-language">
                            {i18n.language === 'ru' ? 'Русский' : 'English'}
                        </span>
                        ▼
                    </button>
                    {dropdownOpen && (
                        <div className="language-dropdown">
                            <button onClick={() => changeLanguage('en')}>English</button>
                            <button onClick={() => changeLanguage('ru')}>Русский</button>
                        </div>
                    )}
                </div>
                <div className="custom-toggle">
                    <input type="checkbox" id="theme-toggle" className="toggle-input" />
                    <label htmlFor="theme-toggle" className="toggle-label">
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
        </header>
    );
}

export default Header;