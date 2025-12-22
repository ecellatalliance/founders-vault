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

    return (
        <>
            <header className="header">
                <div className="container" style={{ position: 'relative' }}>
                    <div className="header-main-content">
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
                            <button
                                className="header-action-btn mobile-only"
                                onClick={() => setSearchOpen(!searchOpen)}
                                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
                            >
                                <i className={`fas ${searchOpen ? 'fa-times' : 'fa-search'} header-action-icon`} style={{ fontSize: '1.2rem' }}></i>
                            </button>

                            {/* Theme Toggle - Circular Icon */}
                            <button
                                className="header-action-btn theme-btn"
                                onClick={toggleTheme}
                                title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
                            >
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} header-action-icon`} style={{ fontSize: '1.2rem' }}></i>
                            </button>

                            {/* Admin & VC Balance (Desktop mostly, or specialized mobile) */}
                            {isAuthenticated && user?.isAdmin && (
                                <button
                                    className="header-action-btn admin-btn desktop-only"
                                    onClick={() => navigate('/admin')}
                                    style={{ color: 'var(--accent-gold)' }}
                                >
                                    <i className="fas fa-user-shield header-action-icon"></i>
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

                            <button className="header-action-btn mobile-hidden" onClick={handleUserAction} id="userBtn">
                                <i className="fas fa-user header-action-icon"></i>
                            </button>

                            {/* Hamburger Menu - Right */}
                            <button
                                className="mobile-menu-toggle"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                style={{ marginLeft: '0.5rem', display: 'none' }} /* display none default, override in CSS */
                            >
                                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id="navLinks">
                    <div className="mobile-menu-content">
                        {/* Mobile User Info Header */}
                        <div className="mobile-user-header" onClick={handleUserAction} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{isAuthenticated ? (user?.name || 'User') : 'Login / Signup'}</div>
                                {isAuthenticated && <div style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginTop: '4px' }}>Balance: {user?.vcBalance || 0}🪙</div>}
                            </div>
                        </div>

                        <ul className="mobile-nav-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li className="mobile-nav-item">
                                <button
                                    className={`mobile-nav-link dropdown-trigger ${categoryOpen ? 'open' : ''}`}
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '1rem 1.5rem', fontSize: '1rem', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <span><i className="fas fa-th-large" style={{ width: '24px', color: 'var(--text-secondary)' }}></i> Categories</span>
                                    <i className={`fas fa-chevron-down ${categoryOpen ? 'rotate' : ''}`} style={{ transition: 'transform 0.3s' }}></i>
                                </button>

                                <div className={`mobile-dropdown ${categoryOpen ? 'open' : ''}`} style={{ display: categoryOpen ? 'block' : 'none', padding: '0 1.5rem 1rem 1.5rem', background: 'var(--bg-secondary-light)' }}>
                                    <div className="category-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <Link to="/shop?sort=bestsellers" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                            <i className="fas fa-heart text-accent" style={{ display: 'block', marginBottom: '4px' }}></i> Best Sellers
                                        </Link>
                                        <Link to="/shop?sort=newest" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                            <i className="fas fa-box-open text-accent" style={{ display: 'block', marginBottom: '4px' }}></i> New
                                        </Link>
                                        <Link to="/shop?category=Tech Essentials" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                            <i className="fas fa-microchip" style={{ display: 'block', marginBottom: '4px' }}></i> Tech
                                        </Link>
                                        <Link to="/shop?category=Premium Apparel" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                            <i className="fas fa-tshirt" style={{ display: 'block', marginBottom: '4px' }}></i> Apparel
                                        </Link>
                                        <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="cat-card-mobile" style={{ gridColumn: '1 / -1', padding: '0.75rem', backgroundColor: 'var(--accent-gold)', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', color: 'var(--primary-navy)', fontWeight: 'bold' }}>
                                            View All
                                        </Link>
                                    </div>
                                </div>
                            </li>

                            <li className="mobile-nav-item">
                                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color-light)' }}>
                                    <i className="fas fa-shopping-bag" style={{ width: '24px', color: 'var(--text-secondary)' }}></i> Shop All
                                </Link>
                            </li>

                            {isAuthenticated && user?.isAdmin && (
                                <li className="mobile-nav-item">
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--accent-gold)', borderTop: '1px solid var(--border-color-light)' }}>
                                        <i className="fas fa-user-shield" style={{ width: '24px' }}></i> Admin Panel
                                    </Link>
                                </li>
                            )}

                            <li className="mobile-nav-item">
                                <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color-light)' }}>
                                    <i className="fas fa-bullhorn" style={{ width: '24px', color: 'var(--text-secondary)' }}></i> Announcements
                                </Link>
                            </li>

                            <li className="mobile-nav-item">
                                <Link to="/earn-vc" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color-light)' }}>
                                    <i className="fas fa-coins" style={{ width: '24px', color: 'var(--text-secondary)' }}></i> How to Earn VCs
                                </Link>
                            </li>

                            <li className="mobile-nav-item">
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color-light)' }}>
                                    <i className="fas fa-info-circle" style={{ width: '24px', color: 'var(--text-secondary)' }}></i> About E-Cell
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
