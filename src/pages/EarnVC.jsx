import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

const EarnVC = () => {
    const steps = [
        {
            number: 1,
            icon: '🎉',
            title: 'Attend Events',
            description: 'Participate in our workshops, seminars, and networking sessions. Every event you attend brings you closer to earning VCs.'
        },
        {
            number: 2,
            icon: '📧',
            title: 'Contact E-Cell',
            description: 'Reach out to the E-Cell team to whitelist your email address. This creates your official profile in our system.',
            action: true
        },
        {
            number: 3,
            icon: '🏆',
            title: 'Participate & Win',
            description: 'Showcase your skills! Participate in hackathons and competitions. Winners earn massive VC bonuses.'
        },
        {
            number: 4,
            icon: '🛍️',
            title: 'Spend VCs',
            description: 'Use your hard-earned VCs to purchase actual products from the Founders Vault store. No real money needed!'
        },
        {
            number: 5,
            icon: '✨',
            title: 'Enjoy',
            description: 'Enjoy your rewards and keep engaging with the E-Cell community for more opportunities.'
        }
    ]

    return (
        <Layout>
            <main className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="text-center mb-8">
                            <h1 className="section-title" style={{ color: 'var(--text-primary)' }}>How to Earn VCs</h1>
                            <p className="section-subtitle" style={{ color: 'var(--text-secondary)' }}>
                                Follow these simple steps to start earning Virtual Coins and shop for free!
                            </p>
                        </div>

                        <div className="steps-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {steps.map((step) => (
                                <div key={step.number} className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                                    <div style={{
                                        minWidth: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-gold)',
                                        color: 'var(--primary-navy)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 'var(--text-lg)'
                                    }}>
                                        {step.number}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
                                            <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>{step.title}</h3>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{step.description}</p>
                                        {step.action && (
                                            <div className="mt-4">
                                                <a href="mailto:ecell@university.edu" className="btn btn-outline btn-sm">
                                                    <i className="fas fa-envelope"></i> Contact E-Cell
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                <i className="fas fa-shopping-bag"></i>
                                Browse Rewards
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default EarnVC
