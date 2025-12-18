import Layout from '../components/Layout'

const About = () => {
    return (
        <Layout>
            <main className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="text-center mb-8">
                            <h1 className="section-title">About E-Cell Alliance University</h1>
                            <p className="section-subtitle">Fostering Innovation and Entrepreneurship</p>
                        </div>

                        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Team collaboration"
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}
                            />

                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Our Mission</h2>
                            <p style={{ marginBottom: 'var(--space-4)' }}>
                                The Entrepreneurship Cell (E-Cell) at Alliance University is a student-led organization dedicated to promoting the spirit of entrepreneurship among students. We believe that every student has the potential to be a change-maker.
                            </p>
                            <p>
                                Through workshops, hackathons, speaker sessions, and our flagship "Founders Vault", we provide the platform and resources necessary for budding entrepreneurs to turn their ideas into reality.
                            </p>
                        </div>

                        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>What is Founders Vault?</h2>
                            <p>
                                Founders Vault is an exclusive marketplace for the E-Cell community. It is a gamified ecosystem where students can spend "Venture Credits" (VCs) earned by participating in E-Cell activities.
                            </p>
                            <ul style={{ paddingLeft: '20px', marginTop: 'var(--space-4)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>🛍️ <strong>Shop for Free:</strong> Use VCs to buy real products.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>🚀 <strong>Support Startups:</strong> Discover products created by student founders.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>🏆 <strong>Earn Rewards:</strong> The more you engage, the more you earn.</li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>Connect With Us</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                                <a href="https://www.linkedin.com/in/e-cell-alliance-university-a41113392/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    <i className="fab fa-linkedin"></i> LinkedIn
                                </a>
                                <a href="https://www.instagram.com/ecellatalliance/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                    <i className="fab fa-instagram"></i> Instagram
                                </a>
                                <a href="mailto:ecell@alliance.edu.in" className="btn btn-outline">
                                    <i className="fas fa-envelope"></i> Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default About
