import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

const EarnVC = () => {
    const { user, isAuthenticated } = useAuth()
    const [graphData, setGraphData] = useState([])
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [currentBalance, setCurrentBalance] = useState(0)

    // Initialize Graph Data & Listen for Realtime Updates
    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Default mock data if not logged in
            setGraphData([100, 350, 200, 600, 450, 800, 1000])
            setCurrentBalance(1000)
            return
        }

        const initialBalance = user.vcBalance || 0
        setCurrentBalance(initialBalance)

        // Generate a "history" curve ending at current balance
        const generateHistory = (endVal) => {
            const history = []
            let val = endVal * 0.5 // Start at 50%
            for (let i = 0; i < 6; i++) {
                // Random walk towards endVal
                const variance = Math.random() * (endVal * 0.4) - (endVal * 0.2)
                val += variance
                if (val < 0) val = 0
                history.push(Math.round(val))
            }
            history.push(endVal)
            return history
        }

        setGraphData(generateHistory(initialBalance))

        // Subscribe to changes
        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
                (payload) => {
                    const newBalance = payload.new.vc_balance
                    console.log('Realtime VC Update:', newBalance)
                    setCurrentBalance(newBalance)

                    setGraphData(prevData => {
                        const newData = [...prevData, newBalance]
                        // Keep max 10 points to keep graph readable, shift if needed
                        if (newData.length > 10) newData.shift()
                        return newData
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, isAuthenticated])

    // --- Graph Calculation Helper ---
    // Helper to generate smooth curve (Catmull-Rom to Cubic Bezier)
    const getPathD = (data, isArea) => {
        if (data.length < 2) return ""

        const maxVal = Math.max(...data, 100)

        // Map data to canvas coordinates (padding included)
        // Canvas: 0-100. Padding range: 5-95 horizontal.
        // Vertical: Top padding 20 units (leaving 80% used).
        const coords = data.map((val, i) => {
            const x = 5 + (i / (data.length - 1)) * 90
            const y = 95 - ((val / maxVal) * 80)
            return [x, y]
        })

        const d = [`M ${coords[0][0]},${coords[0][1]}`]

        for (let i = 0; i < coords.length - 1; i++) {
            const [x0, y0] = i > 0 ? coords[i - 1] : coords[0]
            const [x1, y1] = coords[i]
            const [x2, y2] = coords[i + 1]
            const [x3, y3] = i < coords.length - 2 ? coords[i + 2] : coords[coords.length - 1]

            // Catmull-Rom to Cubic Bezier conversion factors
            const cp1x = x1 + (x2 - x0) / 6
            const cp1y = y1 + (y2 - y0) / 6
            const cp2x = x2 - (x3 - x1) / 6
            const cp2y = y2 - (y3 - y1) / 6

            d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`)
        }

        if (isArea) {
            // Close the path at the bottom
            d.push(`L ${coords[coords.length - 1][0]},120 L ${coords[0][0]},120 Z`)
        }

        return d.join(" ")
    }

    const pathLine = getPathD(graphData, false)
    const pathArea = getPathD(graphData, true)

    // Calculate Points for Circles (Re-calc for alignment)
    const maxValChart = Math.max(...graphData, 100)
    const pointCoords = graphData.map((val, i) => {
        const x = 5 + (i / (graphData.length - 1)) * 90
        const y = 95 - ((val / maxValChart) * 80)
        return { x, y, val }
    })


    const steps = [
        {
            icon: 'fas fa-calendar-check',
            title: 'Attend Events',
            description: 'Join our workshops and sessions to earn points instantly.',
            amount: '25 VCs',
            color: '#4F46E5', // Indigo
            bg: '#EEF2FF'
        },
        {
            icon: 'fas fa-users',
            title: 'Refer Friends',
            description: 'Bring your friends to the E-Cell community.',
            amount: '15 VCs',
            color: '#10B981', // Emerald
            bg: '#ECFDF5'
        },
        {
            icon: 'fas fa-trophy',
            title: 'Win Competitions',
            description: 'Participate and win in our hackathons.',
            amount: '30 VCs',
            color: '#F59E0B', // Amber
            bg: '#FFFBEB'
        },
        {
            icon: 'fas fa-shopping-cart',
            title: 'Shop & Review',
            description: 'Get a chance of cashback VCs when you purchase and review items.',
            amount: '5% Back',
            color: '#EC4899', // Pink
            bg: '#FDF2F8'
        }
    ]

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
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {isAuthenticated ? 'Live updates from your wallet' : 'Log in to see your growth'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>{currentBalance}</span>
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
                                    d={pathArea}
                                    fill="url(#gradient)"
                                />
                                {/* Smooth Line */}
                                <path
                                    d={pathLine}
                                    fill="none"
                                    stroke="var(--accent-gold)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Points */}
                                {pointCoords.map((pt, i) => {
                                    return (
                                        <g key={i}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={hoveredIndex === i ? 4 : 2.5}
                                                fill="var(--bg-primary)"
                                                stroke="var(--primary-navy)"
                                                strokeWidth="1.5"
                                                style={{ transition: 'r 0.2s', cursor: 'pointer' }}
                                            />
                                            {hoveredIndex === i && (
                                                <text
                                                    x={pt.x}
                                                    y={pt.y - 10}
                                                    fontSize="4"
                                                    textAnchor="middle"
                                                    fill="var(--primary-navy)"
                                                    fontWeight="bold"
                                                >
                                                    {pt.val}
                                                </text>
                                            )}
                                        </g>
                                    )
                                })}
                            </svg>

                            {/* X Axis Labels */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                <span>History</span>
                                <span>...</span>
                                <span>...</span>
                                <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default EarnVC
