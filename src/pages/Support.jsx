import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

const Support = () => {
    return (
        <Layout>
            <main className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 className="section-title">Support & Help Center</h1>

                    <div id="faq" style={{ marginBottom: 'var(--space-8)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Frequently Asked Questions</h2>
                        <div className="card">
                            <details style={{ marginBottom: 'var(--space-4)' }}>
                                <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>How do I earn Venture Credits (VC)?</summary>
                                <p style={{ marginTop: 'var(--space-2)' }}>You can earn VCs by attending E-Cell events, participating in workshops, and winning competitions. Check out the <Link to="/earn-vc">How to Earn VCs</Link> page for more details.</p>
                            </details>
                            <details style={{ marginBottom: 'var(--space-4)' }}>
                                <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Where do I pick up my orders?</summary>
                                <p style={{ marginTop: 'var(--space-2)' }}>Once your order is approved, you can pick it up from the E-Cell Office (Founders Vault Desk). You will receive the exact time and location in your Dashboard.</p>
                            </details>
                            <details>
                                <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Can I return purchased items?</summary>
                                <p style={{ marginTop: 'var(--space-2)' }}>Currently, all exchanges are handled manually at the E-Cell office. Please inspect your items upon pickup.</p>
                            </details>
                        </div>
                    </div>

                    <div id="shipping" style={{ marginBottom: 'var(--space-8)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Shipping & Pickup</h2>
                        <div className="card">
                            <p>We do not offer shipping. All orders are for <strong>Campus Pickup Only</strong>.</p>
                            <p>Pickup Location: E-Cell Office, Main Building.</p>
                        </div>
                    </div>

                    <div id="contact" style={{ marginBottom: 'var(--space-8)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Contact Us</h2>
                        <div className="card">
                            <p>Have more questions? Reach out to us directly.</p>
                            <p style={{ marginTop: 'var(--space-4)' }}>
                                <strong>Email:</strong> <a href="mailto:ecell@university.edu" style={{ color: 'var(--primary-color)' }}>ecell@university.edu</a>
                            </p>
                            <p>
                                <strong>Visit us:</strong> E-Cell Office, Mon-Fri (4 PM - 7 PM)
                            </p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/" className="btn btn-outline">Back to Home</Link>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Support
