import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const EarnVC = () => {
    // Mock data for the graph
    const dataPoints = [100, 350, 200, 600, 450, 800, 1000];
    const maxVal = Math.max(...dataPoints);
    const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - (val / maxVal) * 80; // keep some headroom
        return `${x},${y}`;
    }).join(' ');

    const steps = [
        {
            icon: 'fas fa-calendar-check',
            title: 'Attend Events',
            description: 'Join our workshops and sessions to earn points instantly.',
            amount: '50-100 VCs',
            color: '#4F46E5', // Indigo
            bg: '#EEF2FF'
        },
        {
            icon: 'fas fa-users',
            title: 'Refer Friends',
            description: 'Bring your friends to the E-Cell community.',
            amount: '200 VCs',
            color: '#10B981', // Emerald
            bg: '#ECFDF5'
        },
        {
            icon: 'fas fa-trophy',
            title: 'Win Competitions',
            description: 'Participate and win in our hackathons.',
            amount: '500+ VCs',
            color: '#F59E0B', // Amber
            bg: '#FFFBEB'
        },
        {
            icon: 'fas fa-shopping-cart',
            title: 'Shop & Review',
            description: 'Get cashback VCs when you purchase and review items.',
            amount: '10% Back',
            color: '#EC4899', // Pink
            bg: '#FDF2F8'
        }
    ]

    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <Layout>
            <main className="earn-vc-main" style={{ padding: 'var(--space-8) 0', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-navy)' }}>Earn Virtual Coins</h1>
                        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>Unlock exclusive rewards by engaging with the community</p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid-cards mb-12" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-6)'
                    }}>
                        {steps.map((step, index) => (
                            <div key={index}
                                className="earn-card"
                                style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-6)',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                            >
                                <div className="icon-wrapper mb-4" style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: step.bg,
                                    color: step.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    <i className={step.icon}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                                <div className="amount-badge" style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: step.bg,
                                    color: step.color,
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}>
                                    {step.amount}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Graph Section */}
                    <div className="graph-card" style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-8)',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-navy)' }}>VC Growth Tracking</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Your earning history over the last 7 days</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>1,000</span>
                                <span className="ml-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Total VCs</span>
                            </div>
                        </div>

                        <div className="graph-container" style={{ position: 'relative', height: '300px', width: '100%', overflow: 'hidden' }}>
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Area area */}
                                <path
                                    d={`M0,100 ${points.split(' ').map(p => 'L' + p).join(' ')} L100,100 Z`}
                                    fill="url(#gradient)"
                                />
                                {/* Line */}
                                <polyline
                                    fill="none"
                                    stroke="var(--accent-gold)"
                                    strokeWidth="2"
                                    points={points}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Points */}
                                {dataPoints.map((val, i) => {
                                    const x = (i / (dataPoints.length - 1)) * 100;
                                    const y = 100 - (val / maxVal) * 80;
                                    return (
                                        <g key={i}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={hoveredIndex === i ? 2 : 1}
                                                fill="var(--bg-primary)"
                                                stroke="var(--primary-navy)"
                                                strokeWidth="0.5"
                                                style={{ transition: 'r 0.2s' }}
                                            />
                                            {hoveredIndex === i && (
                                                <text
                                                    x={x}
                                                    y={y - 5}
                                                    fontSize="3"
                                                    textAnchor="middle"
                                                    fill="var(--primary-navy)"
                                                    fontWeight="bold"
                                                >
                                                    {val}
                                                </text>
                                            )}
                                        </g>
                                    )
                                })}
                            </svg>

                            {/* X Axis Labels */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default EarnVC
