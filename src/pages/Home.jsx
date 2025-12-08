import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import HeroCarousel from '../components/HeroCarousel'
import ProductCarousel from '../components/ProductCarousel'

const Home = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/data/products.json')
            const data = await response.json()
            setProducts(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const getProductsByPrice = (min, max) => {
        return products.filter(p => p.price >= min && p.price <= max).slice(0, 8)
    }

    const getFeaturedProducts = () => {
        return products.filter(p => p.featured).slice(0, 8)
    }

    const getProductsByCategory = (category) => {
        return products.filter(p => p.category === category).slice(0, 8)
    }

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="loading-spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Featured Products Carousel */}
            <ProductCarousel
                title="⭐ Top Picks for Students"
                products={getFeaturedProducts()}
                viewAllLink="/shop"
            />

            {/* Products Under 300 */}
            <ProductCarousel
                title="Products Under 300🪙"
                products={getProductsByPrice(0, 300)}
                viewAllLink="/shop?maxPrice=300"
            />

            {/* Products 301-1000 */}
            <ProductCarousel
                title="Products 301 - 1000🪙"
                products={getProductsByPrice(301, 1000)}
                viewAllLink="/shop?minPrice=301&maxPrice=1000"
            />

            {/* Premium Products */}
            <ProductCarousel
                title="Premium Products (1000🪙+)"
                products={getProductsByPrice(1001, Infinity)}
                viewAllLink="/shop?minPrice=1000"
            />

            {/* Promotional Cards */}
            <section className="promo-section">
                <div className="container">
                    <div className="promo-grid">
                        <Link
                            to="/shop?category=Tech Essentials"
                            className="promo-card"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            <div className="promo-card-content">
                                <div className="promo-card-icon">💻</div>
                                <h3 className="promo-card-title">Tech Essentials</h3>
                                <p className="promo-card-description">
                                    Laptops, accessories, and gadgets for your academic journey
                                </p>
                                <span className="promo-card-cta">
                                    Shop Now <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/shop?category=Premium Apparel"
                            className="promo-card"
                            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                        >
                            <div className="promo-card-content">
                                <div className="promo-card-icon">👕</div>
                                <h3 className="promo-card-title">Premium Apparel</h3>
                                <p className="promo-card-description">
                                    Branded clothing and merchandise for campus life
                                </p>
                                <span className="promo-card-cta">
                                    Explore <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/shop?category=The Launchpad"
                            className="promo-card"
                            style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
                        >
                            <div className="promo-card-content">
                                <div className="promo-card-icon">🚀</div>
                                <h3 className="promo-card-title">The Launchpad</h3>
                                <p className="promo-card-description">
                                    Support student entrepreneurs and innovative products
                                </p>
                                <span className="promo-card-cta">
                                    Discover <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How to Earn VCs Section */}
            <section className="section" id="earn-vc" style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-12) 0' }}>
                <div className="container">
                    <h2 className="carousel-title" style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>How to earn VC's</h2>
                    <div className="promo-grid">
                        <div className="earn-vc-card" style={{ backgroundColor: 'var(--bg-primary)' }}>
                            <span className="earn-vc-icon">🎉</span>
                            <h3 className="earn-vc-card-title">Participate in events</h3>
                            <p className="earn-vc-card-description">
                                Join our workshops, seminars, and networking sessions to earn VC coins while learning.
                            </p>
                            <span className="earn-vc-amount">+50-200🪙</span>
                        </div>

                        <div className="earn-vc-card" style={{ backgroundColor: 'var(--bg-primary)' }}>
                            <span className="earn-vc-icon">🤝</span>
                            <h3 className="earn-vc-card-title">Refer people</h3>
                            <p className="earn-vc-card-description">
                                Invite your friends to join Founders Vault and earn 🪙 for every successful referral.
                            </p>
                            <span className="earn-vc-amount">+200🪙 per referral</span>
                        </div>

                        <div className="earn-vc-card" style={{ backgroundColor: 'var(--bg-primary)' }}>
                            <span className="earn-vc-icon">🏆</span>
                            <h3 className="earn-vc-card-title">Win Events</h3>
                            <p className="earn-vc-card-description">
                                Compete in hackathons, pitch competitions, and challenges to win big 🪙 rewards!
                            </p>
                            <span className="earn-vc-amount">+500-2000🪙</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Startups Collection */}
            <ProductCarousel
                title="The Launchpad Collection"
                products={getProductsByCategory('The Launchpad')}
                viewAllLink="/shop?category=The Launchpad"
            />

            {/* About E-Cell Section */}
            <section className="carousel-section" id="about" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="carousel-title" style={{ marginBottom: 'var(--space-6)' }}>
                            About Entrepreneurship Cell
                            <a href="https://ecell.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-lg)', marginLeft: 'var(--space-3)', verticalAlign: 'middle' }}>
                                <i className="fas fa-external-link-alt"></i>
                            </a>
                        </h2>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                            The Entrepreneurship Cell (E-Cell) is dedicated to fostering innovation and entrepreneurship among
                            students. Founders Vault is our initiative to provide exclusive deals and support student-led ventures.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <a href="https://ecell.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <i className="fas fa-globe"></i>
                                Visit Website
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                <i className="fab fa-linkedin"></i>
                                LinkedIn
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                <i className="fab fa-instagram"></i>
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
