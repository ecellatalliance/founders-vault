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
        const query = searchQuery.trim().toLowerCase()

        if (query === '/secret' || query === '/admin') {
            navigate('/admin-login')
            setSearchQuery('')
            return
        }

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
                        <Link to="/" className="logo" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Founders Vault" className="logo-img" />
                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginTop: '-4px',
                                letterSpacing: '0.5px',
                                fontStyle: 'italic'
                            }}>
                                First ever rewards store at Alliance University
                            </span>
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
                            <button className="search-btn" onClick={handleSearch}>
                                <span className="search-btn-text">Search</span>
                                <i className="fas fa-search search-btn-icon"></i>
                            </button>
                        </div>

                        {/* Header Actions */}
                        <div className="header-actions">
                            {isAuthenticated && user?.isAdmin && (
                                <button
                                    className="header-action-btn admin-btn"
                                    onClick={() => navigate('/admin')}
                                    style={{ color: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}
                                >
                                    <i className="fas fa-user-shield header-action-icon"></i>
                                    <span className="header-action-label">Admin Panel</span>
                                </button>
                            )}

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
                                <li className="nav-item-dropdown">
                                    <button className="nav-link dropdown-trigger">
                                        Categories <i className="fas fa-chevron-down ml-1"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <div className="category-grid">
                                            {/* Static Links */}
                                            <Link to="/shop?sort=bestsellers" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-heart text-accent"></i>
                                                <span>Best Sellers</span>
                                            </Link>
                                            <Link to="/shop?sort=newest" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-box-open text-accent"></i>
                                                <span>New Arrivals</span>
                                            </Link>

                                            {/* Dynamic Categories (Fallback if DB empty) or just key categories */}
                                            <Link to="/shop?category=Tech Essentials" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-microchip"></i>
                                                <span>Tech Essentials</span>
                                            </Link>
                                            <Link to="/shop?category=Home Hacks" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-couch"></i>
                                                <span>Home Hacks</span>
                                            </Link>
                                            <Link to="/shop?category=Premium Apparel" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-fire text-accent"></i>
                                                <span>Apparel</span>
                                            </Link>
                                            <Link to="/shop?category=Stationery" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-pen"></i>
                                                <span>Stationery</span>
                                            </Link>

                                            {/* Utility Links */}
                                            <Link to="/shop?filter=sale" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-tags text-accent"></i>
                                                <span>Sale</span>
                                            </Link>
                                            <Link to="/shop" className="category-grid-item" onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fas fa-th-large"></i>
                                                <span>View All</span>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li><Link to="/shop" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Shop All</Link></li>
                                {isAuthenticated && user?.isAdmin && (
                                    <li><Link to="/admin" className="nav-link text-accent" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link></li>
                                )}
                                <li><Link to="/community" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Announcements</Link></li>
                                <li><Link to="/earn-vc" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How to earn VCs</Link></li>
                                <li><Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About E-Cell</Link></li>
                            </ul>

                            <button className="theme-toggle" onClick={toggleTheme}>
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} id="themeIcon"></i>
                                <span id="themeLabel">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header
