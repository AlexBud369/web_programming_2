import {Link} from "react-router-dom";
import './footer.css';
import facebookIcon from "../../images/facebook_icon.svg";
import instagramIcon from "../../images/instagram_icon.svg";
import twitterIcon from "../../images/twitter_icon.svg";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__column">
                    <h2 className="footer__title">Shop</h2>
                    <ul className="footer__list">
                        <li><Link to="/home" className="footer__link">Home</Link></li>
                        <li><Link to="/catalog" className="footer__link">Catalog</Link></li>
                    </ul>
                </div>
                <div className="footer__column">
                    <h2 className="footer__title">Contacts</h2>
                    <ul className="footer__list">
                        <li><span className="footer__link">+1 (234) 567-89-00</span></li>
                        <li><a href="mailto:info@euphoria.com" className="footer__link">info@euphoria.com</a></li>
                    </ul>
                </div>
                <section className="footer__subscribe">
                    <h2 className="footer__title">Newsletter</h2>
                    <p className="footer__text">Subscribe for exclusive offers and updates</p>
                    <form className="footer__form">
                    <div className="footer__form-group">
                            <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="footer__input"
                            required
                            ></input>
                        <button type="submit" className="footer__button">
                        <span>Subscribe</span>
                        </button>
                    </div>
                    <p className="footer__disclaimer">We respect your privacy. Unsubscribe at any time.</p>
                    </form>
                </section>
                </div>
                <div className="footer__bottom">
                <div className="footer__social" aria-label="Social media links">
                    <a href="#">
                        <img src={facebookIcon} alt="" className="footer__icon" width="24" height="24"></img>
                    </a>
                    <a href="#">
                        <img src={instagramIcon} alt="" className="footer__icon" width="24" height="24"></img>
                    </a>
                    <a href="#">
                        <img src={twitterIcon} alt="" className="footer__icon" width="24" height="24"></img>
                    </a>
                </div>
                <p className="footer__copyright">Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;