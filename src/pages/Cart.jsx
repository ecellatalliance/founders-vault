import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
    const { user } = useAuth()

    if (cart.length === 0) {
        return (
            <Layout>
                <main style={{ padding: 'var(--space-16) 0', minHeight: 'calc(100vh - 400px)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ fontSize: '8rem', marginBottom: 'var(--space-6)', opacity: 0.3 }}>🛒</div>
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
            <main style={{ padding: 'var(--space-8) 0', minHeight: 'calc(100vh - 400px)' }}>
                <div className="container">
                    <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-8)' }}>
                        Shopping Cart
                    </h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)' }}>
                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {cart.map((item) => (
                                <div key={item.id} className="card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/120'}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                                            {item.name}
                                        </h3>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                            {item.category}
                                        </p>
                                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--accent-gold)' }}>
                                            {item.price}🪙
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-1)' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'none', cursor: 'pointer' }}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span style={{ width: '48px', textAlign: 'center', fontWeight: 'var(--font-semibold)' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'none', cursor: 'pointer' }}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)' }}
                                        >
                                            <i className="fas fa-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-6)' }}>
                                Order Summary
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>{getCartTotal()}🪙</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--success)' }}>FREE</span>
                                </div>
                                {user && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Your VC Balance</span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>{user.vcBalance}🪙</span>
                                    </div>
                                )}
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--accent-gold)' }}>{getCartTotal()}🪙</span>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-3)' }}>
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
