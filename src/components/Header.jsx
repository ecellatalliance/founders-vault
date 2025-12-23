import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const { getCartCount, wishlist } = useCart()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [categoryOpen, setCategoryOpen] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchQuery.trim().toLowerCase()

        if (query === '/secret' || query === '/admin') {
            navigate('/admin-login')
            setSearchQuery('')
            setSearchOpen(false)
            return
        }

        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
            setSearchOpen(false)
        }
    }

    const handleUserAction = () => {
        if (isAuthenticated) {
            navigate('/dashboard')
        } else {
            navigate('/login')
        }
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/')
            setMobileMenuOpen(false)
        }
    }

    return (
        <>
            <header className="header">
                {/* Top Bar / Main Header Content */}
                <div className="header-container-fluid" style={{ position: 'relative' }}>
                    <div className="header-main-content">
                        {/* Mobile Menu Toggle - Left */}
                        <button className="mobile-menu-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>

                        {/* Logo - Left */}
                        <Link to="/" className="logo">
                            <img src="/logo.png" alt="Founders Vault" className="logo-img" />
                            <div className="logo-text desktop-only">
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    marginTop: '-4px',
                                    display: 'block',
                                    letterSpacing: '0.5px',
                                    fontStyle: 'italic'
                                }}>
                                    First ever rewards store at Alliance University
                                </span>
                            </div>
                        </Link>

                        {/* Search Bar - Center Desktop */}
                        <div className={`search-input-wrapper ${searchOpen ? 'mobile-visible' : ''}`}>
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                            <button className="search-btn" onClick={handleSearch}>
                                <i className="fas fa-search search-btn-icon"></i>
                                <span className="search-btn-text">Search</span>
                            </button>
                        </div>

                        {/* Header Actions - Right */}
                        <div className="header-actions">
                            {/* Mobile Search Toggle */}
                            <button className="header-action-btn mobile-only" onClick={() => setSearchOpen(!searchOpen)}>
                                <i className={`fas ${searchOpen ? 'fa-times' : 'fa-search'} header-action-icon`}></i>
                            </button>

                            {/* Theme Toggle */}
                            <button className="header-action-btn theme-btn" onClick={toggleTheme} title="Toggle Theme">
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} header-action-icon`}></i>
                            </button>

                            {/* Admin & VC Balance */}
                            {isAuthenticated && user?.isAdmin && (
                                <button className="header-action-btn admin-btn desktop-only" onClick={() => navigate('/admin')} title="Admin Panel">
                                    <i className="fas fa-user-shield header-action-icon" style={{ color: 'var(--accent-gold)' }}></i>
                                </button>
                            )}

                            {isAuthenticated && (
                                <div className="vc-balance desktop-only" id="vcBalance">
                                    <i className="fas fa-coins"></i>
                                    <span id="vcAmount">{user?.vcBalance || 0}🪙</span>
                                </div>
                            )}

                            <button className="header-action-btn" onClick={() => navigate('/wishlist')}>
                                <i className="fas fa-heart header-action-icon"></i>
                                {wishlist.length > 0 && <span className="header-action-badge">{wishlist.length}</span>}
                            </button>

                            <button className="header-action-btn" onClick={() => navigate('/cart')}>
                                <i className="fas fa-shopping-cart header-action-icon"></i>
                                {getCartCount() > 0 && <span className="header-action-badge">{getCartCount()}</span>}
                            </button>

                            <button className="header-action-btn mobile-hidden" onClick={handleUserAction} title="Account">
                                <i className="fas fa-user header-action-icon"></i>
                            </button>

                            {isAuthenticated && (
                                <button className="header-action-btn mobile-hidden" onClick={handleLogout} title="Logout" style={{ color: 'var(--error)' }}>
                                    <i className="fas fa-power-off header-action-icon"></i>
                                </button>
                            )}

                        </div>
                    </div>
                </div>

                {/* Desktop Navigation Bar */}
                <nav className="nav desktop-only">
                    <div className="header-container-fluid nav-content">
                        <ul className="nav-links">
                            {/* Categories Dropdown */}
                            <li className="nav-item-dropdown">
                                <button className="nav-link dropdown-trigger">
                                    <i className="fas fa-th-large"></i> Categories <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <div className="category-grid">
                                        <Link to="/shop?sort=bestsellers" className="category-grid-item">
                                            <i className="fas fa-heart text-accent"></i>
                                            <span>Best Sellers</span>
                                        </Link>
                                        <Link to="/shop?sort=newest" className="category-grid-item">
                                            <i className="fas fa-box-open text-accent"></i>
                                            <span>New Arrivals</span>
                                        </Link>
                                        <Link to="/shop?category=Tech Essentials" className="category-grid-item">
                                            <i className="fas fa-microchip"></i>
                                            <span>Tech</span>
                                        </Link>
                                        <Link to="/shop?category=Home Hacks" className="category-grid-item">
                                            <i className="fas fa-couch"></i>
                                            <span>Home</span>
                                        </Link>
                                        <Link to="/shop?category=Premium Apparel" className="category-grid-item">
                                            <i className="fas fa-tshirt"></i>
                                            <span>Apparel</span>
                                        </Link>
                                        <Link to="/shop?category=Stationery" className="category-grid-item">
                                            <i className="fas fa-pen-alt"></i>
                                            <span>Stationery</span>
                                        </Link>
                                        <Link to="/shop?category=Accessories" className="category-grid-item">
                                            <i className="fas fa-headphones"></i>
                                            <span>Accessories</span>
                                        </Link>
                                        <Link to="/shop" className="category-grid-item">
                                            <i className="fas fa-arrow-right"></i>
                                            <span>View All</span>
                                        </Link>
                                    </div>
                                </div>
                            </li>

                            <li><Link to="/shop" className="nav-link">Shop All</Link></li>
                            <li><Link to="/community" className="nav-link">Announcements</Link></li>
                            <li><Link to="/earn-vc" className="nav-link">How to Earn VCs</Link></li>
                            <li><Link to="/about" className="nav-link">About E-Cell</Link></li>
                        </ul>
                    </div>
                </nav>

                {/* Mobile Menu Drawer */}
                <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-menu-content">
                        {/* Mobile User Info Header */}
                        <div className="mobile-user-header" onClick={handleUserAction}>
                            <div className="user-avatar-mobile">
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <div className="user-name-mobile">{isAuthenticated ? (user?.name || 'User') : 'Login / Signup'}</div>
                                {isAuthenticated && <div className="user-balance-mobile">Balance: {user?.vcBalance || 0}🪙</div>}
                            </div>
                        </div>

                        <ul className="mobile-nav-list">
                            <li className="mobile-nav-item">
                                <button className={`mobile-nav-link dropdown-trigger ${categoryOpen ? 'open' : ''}`} onClick={() => setCategoryOpen(!categoryOpen)}>
                                    <span><i className="fas fa-th-large"></i> Categories</span>
                                    <i className={`fas fa-chevron-down ${categoryOpen ? 'rotate' : ''}`}></i>
                                </button>

                                <div className={`mobile-dropdown ${categoryOpen ? 'open' : ''}`}>
                                    <div className="category-grid-mobile">
                                        <Link to="/shop?sort=bestsellers" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile"><i className="fas fa-heart text-accent"></i> Best Sellers</Link>
                                        <Link to="/shop?sort=newest" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile"><i className="fas fa-box-open text-accent"></i> New</Link>
                                        <Link to="/shop?category=Tech Essentials" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile"><i className="fas fa-microchip"></i> Tech</Link>
                                        <Link to="/shop?category=Premium Apparel" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile"><i className="fas fa-tshirt"></i> Apparel</Link>
                                        <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile view-all">View All</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="mobile-nav-item"><Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link"><i className="fas fa-shopping-bag"></i> Shop All</Link></li>
                            {isAuthenticated && user?.isAdmin && (
                                <li className="mobile-nav-item"><Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link text-accent"><i className="fas fa-user-shield"></i> Admin Panel</Link></li>
                            )}
                            <li className="mobile-nav-item"><Link to="/community" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link"><i className="fas fa-bullhorn"></i> Announcements</Link></li>
                            <li className="mobile-nav-item"><Link to="/earn-vc" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link"><i className="fas fa-coins"></i> How to Earn VCs</Link></li>
                            <li className="mobile-nav-item"><Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link"><i className="fas fa-info-circle"></i> About E-Cell</Link></li>

                            {isAuthenticated && (
                                <li className="mobile-nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
                                    <button onClick={handleLogout} className="mobile-nav-link" style={{ width: '100%', textAlign: 'left', color: 'var(--error)' }}>
                                        <i className="fas fa-power-off"></i> Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
