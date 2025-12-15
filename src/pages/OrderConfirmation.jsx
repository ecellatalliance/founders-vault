import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const OrderConfirmation = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { order } = location.state || {}

    useEffect(() => {
        if (!order) {
            navigate('/dashboard')
        }
    }, [order, navigate])

    if (!order) return null

    return (
        <Layout>
            <main className="section">
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center', padding: 'var(--space-16) 0' }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: 'var(--space-6)',
                        animation: 'bounceIn 0.5s ease'
                    }}>
                        🎉
                    </div>

                    <h1 className="section-title">Order Confirmed!</h1>
                    <p className="section-subtitle" style={{ color: 'var(--success)' }}>
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>

                    <div className="card" style={{ marginTop: 'var(--space-8)', textAlign: 'left' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: 'var(--space-4)',
                            marginBottom: 'var(--space-4)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                            <span className="badge badge-success">Processing</span>
                        </div>

                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <h4 style={{ marginBottom: 'var(--space-2)' }}>Items</h4>
                            {order.items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: '0.95rem'
                                }}>
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString('en-IN')}🪙</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: 'var(--space-4)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            <span>Total Paid</span>
                            <span style={{ color: 'var(--primary-color)' }}>{order.total.toLocaleString('en-IN')}🪙</span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-4)',
                        marginTop: 'var(--space-8)'
                    }}>
                        <Link to="/dashboard" className="btn btn-outline">
                            View Orders
                        </Link>
                        <Link to="/shop" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default OrderConfirmation
