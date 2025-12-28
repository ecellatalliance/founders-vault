import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { supabase } from '../supabaseClient'
import '../styles/checkout.css'

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
            // 1. Check Balance
            const currentBalance = user?.vc_balance || 0

            if (currentBalance < total) {
                alert('Insufficient Venture Credits!')
                setLoading(false)
                return
            }

            // 2. Create Order in Supabase with 'pending_approval'
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_amount: total,
                    status: 'processing', // Payment status
                    approval_status: 'pending_approval', // Workflow status
                    items: cart,
                    shipping_address: formData,
                    pickup_date: null,
                    pickup_location: null,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (orderError) throw orderError

            // 3. Deduct VC (Optimistic)
            await updateVCBalance(-total)

            console.log('Order placed pending approval!', orderData)

            clearCart()

            navigate('/order-confirmation', {
                state: {
                    order: {
                        id: orderData.id,
                        items: cart,
                        total: total,
                        date: new Date(orderData.created_at),
                        approval_status: 'pending_approval'
                    }
                }
            })
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Failed to place order: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <main className="checkout-main">
                <div className="container">
                    <h1 className="checkout-title">Checkout</h1>

                    <div className="checkout-grid">
                        {/* Shipping Form */}
                        <div className="checkout-form-section">
                            <h2 className="section-heading">Shipping Details</h2>
                            <form id="checkoutForm" onSubmit={handleSubmit} className="checkout-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input input-full"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="input input-full"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="input input-full"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            required
                                            className="input input-full"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ZIP Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="input input-full"
                                            value={formData.zip}
                                            onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary-section">
                            <h2 className="section-heading">Order Summary</h2>

                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString('en-IN')}🪙</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-item">
                                <span>Subtotal</span>
                                <span>{total.toLocaleString('en-IN')}🪙</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span style={{ color: 'var(--primary-color)' }}>{total.toLocaleString('en-IN')}🪙</span>
                            </div>

                            <button
                                type="submit"
                                form="checkoutForm"
                                className="btn btn-primary checkout-btn"
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
