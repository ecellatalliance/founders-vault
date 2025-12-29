import Layout from '../components/Layout'
import '../styles/about.css'

const About = () => {
    return (
        <Layout>
            <main className="about-main">
                <div className="container">
                    <div className="about-header">
                        <h1 className="about-title">About E-Cell</h1>
                        <p className="about-subtitle">Sparking Innovation at Alliance University</p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="bento-grid">

                        {/* Card 1: Who We Are (Span 2 cols) */}
                        <div className="bento-card span-2">
                            <div className="icon-box mb-4">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-navy)' }}>Who We Are</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>
                                The Entrepreneurship Cell (E-Cell) at Alliance University is a high-octane ecosystem engineered to ignite the entrepreneurial spirit. We serve as the ultimate launchpad for visionaries, transforming innovative concepts into market-ready ventures through strategic mentorship, comprehensive resources, and a global network of industry leaders.
                            </p>
                        </div>

                        {/* Card 2: Instagram Embed (Tall, Span 2 rows) */}
                        <div className="bento-card reel-card row-span-2">
                            <iframe
                                src="https://www.instagram.com/p/DOk_wuPiKyQ/embed"
                                className="reel-iframe"
                                frameBorder="0"
                                scrolling="no"
                                allowtransparency="true"
                            ></iframe>
                        </div>

                        {/* Card 3: Founders Vault (Dark Theme) */}
                        <div className="bento-card vault-card">
                            <div className="icon-box mb-4">
                                <i className="fas fa-coins"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Founders Vault</h3>
                            <p>
                                Our flagship rewards store. Earn 'Venture Credits' (VCs) by engaging in events and spend them here on real products!
                            </p>
                        </div>

                        {/* Card 4: Stats/Impact */}
                        <div className="bento-card stat-card">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Student Entrepreneurs</div>
                        </div>

                        {/* Card 5: Connect (Span 3 for full bottom banner effect) */}
                        <div className="bento-card connect-card span-3">
                            <div>
                                <h3 className="text-xl font-bold" style={{ color: 'var(--primary-navy)' }}>Join the Movement</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Follow us for updates and events.</p>
                            </div>
                            <div className="social-links">
                                <a href="https://www.instagram.com/ecellatalliance/" target="_blank" rel="noopener noreferrer" className="btn btn-outline social-btn">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/in/e-cell-alliance-university-a41113392/" target="_blank" rel="noopener noreferrer" className="btn btn-primary social-btn">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="mailto:ecell@alliance.edu.in" className="btn btn-outline social-btn">
                                    <i className="fas fa-envelope"></i>
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
