import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const Checkout = () => {
    const navigate = useNavigate()
    const { cart, getCartTotal, clearCart } = useCart()
    const { user, updateVCBalance } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: ''
    })

    const total = getCartTotal()

    if (cart.length === 0) {
        return (
            <Layout>
                <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                    <h1>Your Cart is Empty</h1>
                    <p style={{ marginBottom: 'var(--space-6)' }}>Add some products to proceed to checkout.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                        Go to Shop
                    </button>
                </div>
            </Layout>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Mock order placement
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate VC deduction (assuming 1:1 conversion for simplicity if total <= balance)
            const currentBalance = user?.vc_balance || 0

            // In a real app, backend handles this transaction atomically. 
            // Here we update optimistic UI and profile db.
            if (currentBalance >= total) {
                await updateVCBalance(-total)
            } else {
                console.warn('Insufficient balance - proceeding as external payment order')
            }

            console.log('Order placed!', { items: cart, total, customer: formData })
            console.log('Deducting VCs:', total)

            clearCart()

            navigate('/order-confirmation', {
                state: {
                    order: {
                        id: 'ORD' + Math.floor(Math.random() * 10000),
                        items: cart,
                        total: total,
                        date: new Date()
                    }
                }
            })
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Failed to place order.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <main className="checkout-main" style={{ padding: 'var(--space-8) 0' }}>
                <div className="container">
                    <h1 style={{ marginBottom: 'var(--space-6)' }}>Checkout</h1>

                    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-8)' }}>
                        {/* Shipping Form */}
                        <div className="checkout-form-section">
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Shipping Details</h2>
                            <form id="checkoutForm" onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        style={{ width: '100%' }}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="input"
                                        style={{ width: '100%' }}
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        style={{ width: '100%' }}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>City</label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            style={{ width: '100%' }}
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>ZIP Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            style={{ width: '100%' }}
                                            value={formData.zip}
                                            onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary-section" style={{
                            background: 'var(--bg-secondary)',
                            padding: 'var(--space-6)',
                            borderRadius: 'var(--radius-lg)',
                            height: 'fit-content'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Order Summary</h2>

                            <div className="summary-items" style={{ marginBottom: 'var(--space-4)' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.95rem' }}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString('en-IN')}🪙</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-4) 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span>Subtotal</span>
                                <span>{total.toLocaleString('en-IN')}🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontWeight: 700, fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary-color)' }}>{total.toLocaleString('en-IN')}🪙</span>
                            </div>

                            <button
                                type="submit"
                                form="checkoutForm"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: 'var(--space-3)' }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Checkout
