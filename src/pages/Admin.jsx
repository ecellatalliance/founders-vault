import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const Admin = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('dashboard')
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        activeProducts: 0
    })

    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            navigate('/dashboard')
        }
        // Load mock stats
        setStats({
            totalSales: 15420,
            totalOrders: 45,
            totalUsers: 128,
            activeProducts: 24
        })
    }, [isAuthenticated, user, navigate])

    if (!isAuthenticated || !user?.isAdmin) return null

    const renderDashboard = () => (
        <section className="section active">
            <div className="admin-header">
                <h1 className="admin-title">Dashboard</h1>
                <p className="admin-subtitle">Overview of your store</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <i className="fas fa-coins"></i>
                        </div>
                    </div>
                    <h3 className="stat-card-title">Total Sales</h3>
                    <div className="stat-card-value">{stats.totalSales} 🪙</div>
                    <div className="stat-card-change">
                        <i className="fas fa-arrow-up"></i>
                        <span>+12% this week</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                    <h3 className="stat-card-title">Total Orders</h3>
                    <div className="stat-card-value">{stats.totalOrders}</div>
                    <div className="stat-card-change">
                        <i className="fas fa-arrow-up"></i>
                        <span>+5 new today</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                    <h3 className="stat-card-title">Total Users</h3>
                    <div className="stat-card-value">{stats.totalUsers}</div>
                    <div className="stat-card-change">
                        <i className="fas fa-user-plus"></i>
                        <span>+3 new today</span>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h3>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                    <i className="fas fa-chart-line"></i> All systems operational. Store is running smoothly.
                </p>
            </div>
        </section>
    )

    const renderProducts = () => (
        <section className="section active">
            <div className="admin-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="admin-title">Products</h1>
                        <p className="admin-subtitle">Manage your product catalog</p>
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Add Product
                    </button>
                </div>
            </div>
            <div className="empty-state">
                <i className="fas fa-box"></i>
                <p>Product management coming soon</p>
            </div>
        </section>
    )

    const renderUsers = () => (
        <section className="section active">
            <div className="admin-header">
                <h1 className="admin-title">Users</h1>
                <p className="admin-subtitle">Manage user accounts</p>
            </div>
            <div className="empty-state">
                <i className="fas fa-users"></i>
                <p>User management coming soon</p>
            </div>
        </section>
    )

    const renderOrders = () => (
        <section className="section active">
            <div className="admin-header">
                <h1 className="admin-title">Orders</h1>
                <p className="admin-subtitle">View and manage orders</p>
            </div>
            <div className="empty-state">
                <i className="fas fa-shopping-cart"></i>
                <p>Order management coming soon</p>
            </div>
        </section>
    )

    const renderAnnouncements = () => (
        <section className="section active">
            <div className="admin-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="admin-title">Announcements</h1>
                        <p className="admin-subtitle">Manage community announcements</p>
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> New Announcement
                    </button>
                </div>
            </div>
            <div className="empty-state">
                <i className="fas fa-bullhorn"></i>
                <p>Announcement management coming soon</p>
            </div>
        </section>
    )

    return (
        <Layout>
            <main>
                <div className="container">
                    <div className="admin-container">
                        {/* Sidebar */}
                        <aside className="admin-sidebar">
                            <nav className="admin-nav">
                                <button
                                    className={`admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('dashboard')}
                                >
                                    <i className="fas fa-tachometer-alt"></i> Dashboard
                                </button>
                                <button
                                    className={`admin-nav-item ${activeSection === 'products' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('products')}
                                >
                                    <i className="fas fa-box"></i> Products
                                </button>
                                <button
                                    className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('users')}
                                >
                                    <i className="fas fa-users"></i> Users
                                </button>
                                <button
                                    className={`admin-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('orders')}
                                >
                                    <i className="fas fa-shopping-cart"></i> Orders
                                </button>
                                <button
                                    className={`admin-nav-item ${activeSection === 'announcements' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('announcements')}
                                >
                                    <i className="fas fa-bullhorn"></i> Announcements
                                </button>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <div className="admin-content">
                            {activeSection === 'dashboard' && renderDashboard()}
                            {activeSection === 'products' && renderProducts()}
                            {activeSection === 'users' && renderUsers()}
                            {activeSection === 'orders' && renderOrders()}
                            {activeSection === 'announcements' && renderAnnouncements()}
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Admin
