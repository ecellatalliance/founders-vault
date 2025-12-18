import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">
                    <div>
                        <h4 className="footer-section-title">Founders Vault</h4>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Your trusted platform for exclusive student deals and innovative products from student startups.
                        </p>
                        <div className="footer-social">
                            <a href="https://www.instagram.com/ecellatalliance/" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/e-cell-alliance-university-a41113392/" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-section-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop" className="footer-link">Shop</Link></li>
                            <li><Link to="/cart" className="footer-link">Cart</Link></li>
                            <li><Link to="/wishlist" className="footer-link">Wishlist</Link></li>
                            <li><Link to="/dashboard" className="footer-link">My Account</Link></li>
                            <li><Link to="/community" className="footer-link">Announcements</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-section-title">Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Tech Essentials" className="footer-link">Tech Essentials</Link></li>
                            <li><Link to="/shop?category=Premium Apparel" className="footer-link">Premium Apparel</Link></li>
                            <li><Link to="/shop?category=The Launchpad" className="footer-link">The Launchpad</Link></li>
                            <li><Link to="/shop?category=Office Supplies" className="footer-link">Office Supplies</Link></li>
                            <li><Link to="/shop?category=Books & Learning" className="footer-link">Books & Learning</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-section-title">Support</h4>
                        <ul className="footer-links">
                            <li><Link to="/support#faq" className="footer-link">Help Center</Link></li>
                            <li><Link to="/support#shipping" className="footer-link">Shipping Info</Link></li>
                            <li><Link to="/support#faq" className="footer-link">Returns</Link></li>
                            <li><Link to="/support#contact" className="footer-link">Contact Us</Link></li>
                            <li><Link to="/support#faq" className="footer-link">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Founders Vault. Powered by E-Cell. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
