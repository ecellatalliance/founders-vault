import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import '../styles/cart.css'

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate() // Hook for navigation

    if (cart.length === 0) {
        return (
            <Layout>
                <main className="cart-main">
                    <div className="container">
                        <div className="cart-empty">
                            <div className="empty-icon">🛒</div>
                            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                                Your cart is empty
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                                Add some products to get started!
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
            <main className="cart-main">
                <div className="container">
                    <h1 className="cart-title">Shopping Cart</h1>

                    <div className="cart-grid">
                        {/* Cart Items */}
                        <div className="cart-items-list">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item-card">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-image"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/120'}
                                    />
                                    <div className="cart-item-details">
                                        <div className="cart-item-info">
                                            <h3>{item.name}</h3>
                                            <p className="cart-item-category">{item.category}</p>
                                            <p className="cart-item-price">{item.price}🪙</p>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="qty-btn"
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="qty-btn"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="remove-btn"
                                        >
                                            <i className="fas fa-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="cart-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-row">
                                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                <span style={{ fontWeight: '600' }}>{getCartTotal().toLocaleString('en-IN')}🪙</span>
                            </div>
                            <div className="summary-row">
                                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                <span style={{ fontWeight: '600', color: 'var(--success)' }}>FREE</span>
                            </div>
                            {user && (
                                <div className="summary-row">
                                    <span style={{ color: 'var(--text-secondary)' }}>Your VC Balance</span>
                                    <span style={{ fontWeight: '600' }}>{user.vcBalance || user.vc_balance}🪙</span>
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Total</span>
                                <span style={{ color: 'var(--accent-gold)' }}>{getCartTotal().toLocaleString('en-IN')}🪙</span>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                                onClick={() => navigate('/checkout')}
                            >
                                <i className="fas fa-check"></i>
                                Proceed to Checkout
                            </button>
                            <button onClick={clearCart} className="btn btn-outline" style={{ width: '100%' }}>
                                <i className="fas fa-trash"></i>
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Cart
