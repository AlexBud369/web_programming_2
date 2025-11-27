import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './footer.css';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__column">
                <h2 className="footer__title">{t('footer.shop')}</h2>
                <ul className="footer__list">
                    <li><Link to="/home" className="footer__link">{t('header.home')}</Link></li>
                    <li><Link to="/catalog" className="footer__link">{t('header.catalog')}</Link></li>
                    <li><Link to="/cart" className="footer__link">{t('header.cart')}</Link></li>
                    <li><Link to="/admin" className="footer__link">{t('header.admin')}</Link></li>
                </ul>
                </div>
                <div className="footer__column">
                <h2 className="footer__title">{t('footer.contacts')}</h2>
                <ul className="footer__list">
                    <li><span className="footer__link">+1 (234) 567-89-00</span></li>
                    <li><a href="mailto:info@euphoria.com" className="footer__link">info@euphoria.com</a></li>
                </ul>
                </div>
                <section className="footer__subscribe">
                <h2 className="footer__title">{t('footer.newsletter')}</h2>
                <p className="footer__text">{t('footer.subscribe')}</p>
                <form className="footer__form">
                    <div className="footer__form-group">
                    <input 
                        type="email" 
                        placeholder={t('footer.placeholder')} 
                        className="footer__input"
                        required
                    />
                    <button type="submit" className="footer__button">
                        <span>{t('footer.button')}</span>
                    </button>
                    </div>
                    <p className="footer__disclaimer">{t('footer.disclaimer')}</p>
                </form>
                </section>
            </div>
            <div className="footer__bottom">
                <div className="footer__social">
                <a href="#"><img src="/images/spec/facebook_icon.svg" alt="" className="footer__icon" /></a>
                <a href="#"><img src="/images/spec/instagram_icon.svg" alt="" className="footer__icon" /></a>
                <a href="#"><img src="/images/spec/twitter_icon.svg" alt="" className="footer__icon" /></a>
                </div>
                <p className="footer__copyright">{t('footer.copyright')}</p>
            </div>
        </footer>
    );
    }

export default Footer;