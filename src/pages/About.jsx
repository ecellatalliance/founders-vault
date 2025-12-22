import Layout from '../components/Layout'

const About = () => {
    return (
        <Layout>
            <main className="about-main" style={{ padding: 'var(--space-8) 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh' }}>
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-navy)' }}>About E-Cell</h1>
                        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>Sparking Innovation at Alliance University</p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="bento-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gridAutoRows: 'minmax(200px, auto)',
                        gap: 'var(--space-6)',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>

                        {/* Card 1: Who We Are (Span 2 cols if space permits) */}
                        <div className="bento-card" style={{
                            gridColumn: 'span 2',
                            backgroundColor: 'var(--bg-primary)',
                            padding: 'var(--space-8)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div className="icon-box mb-4" style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-navy)' }}>Who We Are</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                The Entrepreneurship Cell (E-Cell) at Alliance University is a vibrant ecosystem dedicated to fostering the spirit of entrepreneurship. We are a student-led body that provides a platform for budding entrepreneurs to turn their innovative ideas into reality through mentorship, resources, and networking.
                            </p>
                        </div>

                        {/* Card 2: Instagram Reel (Tall) */}
                        <div className="bento-card reel-card" style={{
                            gridRow: 'span 2',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative',
                            minHeight: '500px'
                        }}>
                            <iframe
                                src="https://www.instagram.com/reel/DFSLyW_y1kI/embed"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                allowtransparency="true"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            ></iframe>
                        </div>

                        {/* Card 3: Founders Vault */}
                        <div className="bento-card" style={{
                            backgroundColor: 'var(--primary-navy)',
                            color: '#fff',
                            padding: 'var(--space-8)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div className="icon-box mb-4" style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>
                                <i className="fas fa-coins"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Founders Vault</h3>
                            <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                                Our flagship rewards store. Earn 'Venture Credits' (VCs) by engaging in events and spend them here on real products!
                            </p>
                        </div>

                        {/* Card 4: Stats/Impact */}
                        <div className="bento-card" style={{
                            backgroundColor: 'var(--bg-primary)',
                            padding: 'var(--space-8)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-md)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="stat-number" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>500+</div>
                            <div className="stat-label" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Student Entrepreneurs</div>
                        </div>

                        {/* Card 5: Connect */}
                        <div className="bento-card" style={{
                            gridColumn: 'span 2',
                            backgroundColor: 'var(--bg-primary)',
                            padding: 'var(--space-6)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 'var(--space-4)'
                        }}>
                            <div>
                                <h3 className="text-xl font-bold" style={{ color: 'var(--primary-navy)' }}>Join the Movement</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Follow us for updates and events.</p>
                            </div>
                            <div className="social-links" style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                <a href="https://www.instagram.com/ecellatalliance/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/in/e-cell-alliance-university-a41113392/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="mailto:ecell@alliance.edu.in" className="btn btn-outline" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
