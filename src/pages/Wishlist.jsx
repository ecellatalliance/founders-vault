import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'

const Wishlist = () => {
    const { wishlist, clearWishlist } = useCart()

    if (wishlist.length === 0) {
        return (
            <Layout>
                <main style={{ padding: 'var(--space-16) 0', minHeight: 'calc(100vh - 400px)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ fontSize: '8rem', marginBottom: 'var(--space-6)', opacity: 0.3 }}>❤️</div>
                            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                                Your wishlist is empty
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                                Save your favorite products here!
                            </p>
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                <i className="fas fa-shopping-bag"></i>
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </main>
            </Layout>
        )
    }

    return (
        <Layout>
            <main style={{ padding: 'var(--space-8) 0', minHeight: 'calc(100vh - 400px)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)' }}>My Wishlist</h1>
                        <button onClick={clearWishlist} className="btn btn-outline">
                            <i className="fas fa-trash"></i>
                            Clear Wishlist
                        </button>
                    </div>

                    <div className="products-grid">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Wishlist
