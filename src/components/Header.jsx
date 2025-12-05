import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

const Header = () => {
    const { user, isAuthenticated } = useAuth()
    const { getCartCount, wishlist } = useCart()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    const handleUserAction = () => {
        if (isAuthenticated) {
            navigate('/dashboard')
        } else {
            navigate('/login')
        }
    }

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-main-content">
                        {/* Logo */}
                        <Link to="/" className="logo">
                            <div className="logo-icon">🚀</div>
                            <div className="logo-text">
                                <span className="logo-text-main">Founders Vault</span>
                                <span className="logo-text-sub">by E-Cell@AU</span>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '600px', margin: '0 var(--space-6)' }}>
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                id="searchInput"
                                placeholder="Search for products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                            <button className="search-btn" onClick={handleSearch}>Search</button>
                        </div>

                        {/* Header Actions */}
                        <div className="header-actions">
                            {isAuthenticated && (
                                <div className="vc-balance" id="vcBalance">
                                    <i className="fas fa-coins"></i>
                                    <span id="vcAmount">{user?.vcBalance || 0}🪙</span>
                                </div>
                            )}

                            <button className="header-action-btn" onClick={() => navigate('/wishlist')}>
                                <i className="fas fa-heart header-action-icon"></i>
                                <span className="header-action-label">Wishlist</span>
                                <span className="header-action-badge" id="wishlistCount">{wishlist.length}</span>
                            </button>

                            <button className="header-action-btn" onClick={() => navigate('/cart')}>
                                <i className="fas fa-shopping-cart header-action-icon"></i>
                                <span className="header-action-label">Cart</span>
                                <span className="header-action-badge" id="cartCount">{getCartCount()}</span>
                            </button>

                            <button className="header-action-btn" id="userBtn" onClick={handleUserAction}>
                                <i className="fas fa-user header-action-icon"></i>
                                <span className="header-action-label" id="userLabel">
                                    {isAuthenticated ? (user?.name?.split(' ')[0] || 'User') : 'Login'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="nav">
                    <div className="container">
                        <div className="nav-content">
                            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className="fas fa-bars"></i>
                            </button>

                            <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id="navLinks">
                                <li><Link to="/" className="nav-link">Home</Link></li>
                                <li><Link to="/shop" className="nav-link">Shop</Link></li>
                                <li><Link to="/shop?category=Tech Essentials" className="nav-link">Tech Essentials</Link></li>
                                <li><Link to="/shop?category=Premium Apparel" className="nav-link">Apparel</Link></li>
                                <li><Link to="/shop?category=The Launchpad" className="nav-link">The Launchpad</Link></li>
                                <li><Link to="/community" className="nav-link">Announcements</Link></li>
                                <li><a href="#about" className="nav-link">About Entrepreneurship Cell</a></li>
                            </ul>

                            <button className="theme-toggle" onClick={toggleTheme}>
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} id="themeIcon"></i>
                                <span id="themeLabel">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Category Icon Bar */}
            <div className="category-icon-bar">
                <div className="container">
                    <div className="category-icons-scroll">
                        <Link to="/shop?sort=bestsellers" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-heart"></i></div>
                            <span>Best Sellers</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?sort=newest" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-box-open"></i></div>
                            <span>New Arrivals</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?filter=sale" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-tags"></i></div>
                            <span>Sale</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?category=Home" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-couch"></i></div>
                            <span>Home Hacks</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?sort=trending" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-fire"></i></div>
                            <span>Top 100</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?category=Bottles" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-wine-bottle"></i></div>
                            <span>Bottles & Sippers</span>
                        </Link>
                        <div className="category-separator"></div>
                        <Link to="/shop?category=Storage" className="category-icon-item">
                            <div className="icon-circle"><i className="fas fa-archive"></i></div>
                            <span>Storage & Organizers</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
