import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { supabase } from '../supabaseClient'

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

    const handleAddProduct = async (e) => {
        e.preventDefault()
        const form = e.target
        const productData = {
            name: form.name.value,
            description: form.description.value,
            price: parseFloat(form.price.value),
            category: form.category.value,
            image_url: form.image_url.value,
            stock: parseInt(form.stock.value),
            rating: 4.5, // Default start rating
            reviews: 0,
            features: form.features.value.split(',').map(f => f.trim())
        }

        try {
            const { error } = await supabase.from('products').insert([productData])
            if (error) throw error
            alert('✅ Product added successfully!')
            form.reset()
        } catch (error) {
            console.error('Error adding product:', error)
            alert('Error adding product: ' + error.message)
        }
    }

    const renderProducts = () => (
        <section className="section active">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Products</h1>
                    <p className="admin-subtitle">Manage your product catalog</p>
                </div>
            </div>

            <div className="admin-card" style={{ maxWidth: '800px', margin: '0 0' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Add New Product</h3>
                <form className="login-form" onSubmit={handleAddProduct}>
                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input name="name" className="form-input" required placeholder="e.g. Wireless Headphones" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-input" required rows="3" placeholder="Product details..."></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Price (🪙)</label>
                            <input name="price" type="number" className="form-input" required placeholder="499" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock</label>
                            <input name="stock" type="number" className="form-input" required placeholder="50" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-input" required>
                                <option value="Tech Essentials">Tech Essentials</option>
                                <option value="Premium Apparel">Premium Apparel</option>
                                <option value="The Launchpad">The Launchpad</option>
                                <option value="Home Hacks">Home Hacks</option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input name="image_url" className="form-input" required placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Features (comma separated)</label>
                        <input name="features" className="form-input" placeholder="Long battery life, Noise cancelling, ..." />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-plus"></i> Add Product
                    </button>
                </form>
            </div>
        </section>
    )

    const handleAddUser = async (e) => {
        e.preventDefault()
        const form = e.target
        // Note: Real user creation requires Supabase Auth API interactively or Admin API (backend).
        // Here we will just create a Profile entry for simulation/management purposes
        // or guide the admin.

        alert("To create a new login-able user, please use the Registration page or Supabase Dashboard. \n\nAdding users directly via Admin Console requires 'Service Role' keys which are not safe for client-side.")
    }

    const renderUsers = () => (
        <section className="section active">
            <div className="admin-header">
                <h1 className="admin-title">Users</h1>
                <p className="admin-subtitle">Manage user accounts</p>
            </div>

            <div className="admin-card">
                <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                    <i className="fas fa-user-shield" style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}></i>
                    <h3>User Management</h3>
                    <p>For security, new users should register themselves via the Login page.</p>
                    <p>You can manage existing users (ban/promote) directly in the Supabase Dashboard &gt; Authentication.</p>

                    <a href="https://supabase.com/dashboard/project/ydusbkvnkxtfudleiukk/auth/users" target="_blank" className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }}>
                        <i className="fas fa-external-link-alt"></i> Go to Supabase Auth
                    </a>
                </div>
            </div>
        </section>
    )

    const renderOrders = () => {
        // Mock data for admin view
        const adminOrders = [
            { id: 'ORD5512', customer: 'John Doe', date: '2025-12-15', total: 1200, status: 'Processing' },
            { id: 'ORD5513', customer: 'Jane Smith', date: '2025-12-14', total: 450, status: 'Shipped' },
            { id: 'ORD5514', customer: 'Bob Johnson', date: '2025-12-14', total: 2200, status: 'Delivered' },
            { id: 'ORD5515', customer: 'Alice Brown', date: '2025-12-13', total: 850, status: 'Processing' }
        ]

        return (
            <section className="section active">
                <div className="admin-header">
                    <h1 className="admin-title">Orders</h1>
                    <p className="admin-subtitle">View and manage orders</p>
                </div>

                <div className="admin-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                                <th style={{ padding: 'var(--space-3)' }}>Order ID</th>
                                <th style={{ padding: 'var(--space-3)' }}>Customer</th>
                                <th style={{ padding: 'var(--space-3)' }}>Date</th>
                                <th style={{ padding: 'var(--space-3)' }}>Total</th>
                                <th style={{ padding: 'var(--space-3)' }}>Status</th>
                                <th style={{ padding: 'var(--space-3)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminOrders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--space-3)' }}>{order.id}</td>
                                    <td style={{ padding: 'var(--space-3)' }}>{order.customer}</td>
                                    <td style={{ padding: 'var(--space-3)' }}>{order.date}</td>
                                    <td style={{ padding: 'var(--space-3)' }}>{order.total} 🪙</td>
                                    <td style={{ padding: 'var(--space-3)' }}>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-3)' }}>
                                        <button className="btn btn-outline btn-sm" onClick={() => alert(`View details for ${order.id}`)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }

    const handleAddAnnouncement = async (e) => {
        e.preventDefault()
        const form = e.target
        const announcementData = {
            title: form.title.value,
            content: form.content.value,
            category: form.category.value,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        try {
            const { error } = await supabase.from('announcements').insert([announcementData])
            if (error) throw error
            alert('✅ Announcement posted!')
            form.reset()
        } catch (error) {
            console.error('Error posting announcement:', error)
            alert('Error: ' + error.message)
        }
    }

    const renderAnnouncements = () => (
        <section className="section active">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Announcements</h1>
                    <p className="admin-subtitle">Manage community announcements</p>
                </div>
            </div>

            <div className="admin-card" style={{ maxWidth: '800px' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Post New Announcement</h3>
                <form className="login-form" onSubmit={handleAddAnnouncement}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input name="title" className="form-input" required placeholder="e.g. Workshop on AI" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select name="category" className="form-input" required>
                            <option value="General">General</option>
                            <option value="Event">Event</option>
                            <option value="Workshop">Workshop</option>
                            <option value="News">News</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea name="content" className="form-input" required rows="4" placeholder="Announcement details..."></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-paper-plane"></i> Post Announcement
                    </button>
                </form>
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
