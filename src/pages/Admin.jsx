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

        if (activeSection === 'users') {
            fetchUsers()
        }
    }, [isAuthenticated, user, navigate, activeSection])

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
            source_link: form.source_link.value, // Added source link
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

    const [products, setProducts] = useState([])

    useEffect(() => {
        if (activeSection === 'products') {
            fetchProducts()
        }
    }, [activeSection])

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false })

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if (error) throw error
            setProducts(products.filter(p => p.id !== id))
            alert('Product deleted!')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Error deleting product: ' + error.message)
        }
    }

    const handleDeleteAllProducts = async () => {
        const confirmStr = prompt("Type 'DELETE' to confirm deleting ALL products (cannot be undone):")
        if (confirmStr !== 'DELETE') return

        try {
            // Fetch all IDs first? Or try bulk delete
            const { error } = await supabase
                .from('products')
                .delete()
                .neq('id', 0) // Delete all

            if (error) throw error
            setProducts([])
            alert('All products deleted!')
        } catch (error) {
            console.error('Error deleting all products:', error)
            alert('Error deleting products: ' + error.message)
        }
    }

    const renderProducts = () => (
        <section className="section active">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Products</h1>
                    <p className="admin-subtitle">Manage your product catalog</p>
                </div>
                <div>
                    <button onClick={handleDeleteAllProducts} className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }}>
                        <i className="fas fa-trash"></i> Delete ALL
                    </button>
                </div>
            </div>

            <div className="admin-card" style={{ maxWidth: '100%', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Product List ({products.length})</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '8px' }}>Name</th>
                                <th style={{ padding: '8px' }}>Price</th>
                                <th style={{ padding: '8px' }}>Category</th>
                                <th style={{ padding: '8px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No products found.</td></tr>
                            ) : (
                                products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '8px' }}>{p.name}</td>
                                        <td style={{ padding: '8px' }}>{p.price}</td>
                                        <td style={{ padding: '8px' }}>{p.category}</td>
                                        <td style={{ padding: '8px' }}>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="btn btn-sm btn-outline"
                                                style={{ color: 'red', borderColor: 'red' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-card" style={{ maxWidth: '800px', margin: '0 0' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Add New Product</h3>
                <form className="login-form" onSubmit={handleAddProduct}>
                    {/* Reuse existing form content... but wait, replace_file_content replaces the BLOCK. 
                        I need to include the form content in the ReplacementContent or reference it. 
                        The block I selected (StartLine 120, EndLine 181) includes the whole renderProducts.
                        I will copy-paste the form back in.
                    */}
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
                            <input name="category" className="form-input" required placeholder="e.g. Electronics" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input name="image_url" className="form-input" required placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Source Link (Amazon/Flipkart)</label>
                        <input name="source_link" className="form-input" placeholder="https://amazon.in/..." />
                        <small style={{ color: 'var(--text-secondary)' }}>Admin-only link to purchase items for fulfillment.</small>
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

    const [users, setUsers] = useState([])
    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleUpdateBalance = async (userId, currentBalance) => {
        const newBalanceStr = prompt(`Enter new VC Balance for user (Current: ${currentBalance}):`, currentBalance)
        if (newBalanceStr === null) return
        const newBalance = parseInt(newBalanceStr)
        if (isNaN(newBalance)) return alert("Invalid number")

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ vc_balance: newBalance })
                .eq('id', userId)

            if (error) throw error
            setUsers(users.map(u => u.id === userId ? { ...u, vc_balance: newBalance } : u))
            alert("Balance updated!")
        } catch (error) {
            console.error("Error updating balance:", error)
            alert("Error: " + error.message)
        }
    }

    const renderUsers = () => (
        <section className="section active">
            <div className="admin-header">
                <h1 className="admin-title">Users</h1>
                <p className="admin-subtitle">Manage user accounts & Balances</p>
            </div>

            <div className="admin-card" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '8px' }}>Name</th>
                            <th style={{ padding: '8px' }}>Email</th>
                            <th style={{ padding: '8px' }}>Balance (VC)</th>
                            <th style={{ padding: '8px' }}>Role</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '8px' }}>{u.name}</td>
                                <td style={{ padding: '8px' }}>{u.email}</td>
                                <td style={{ padding: '8px' }}>{u.vc_balance} 🪙</td>
                                <td style={{ padding: '8px' }}>
                                    {u.is_admin ? <span className="badge badge-primary">Admin</span> : 'User'}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => handleUpdateBalance(u.id, u.vc_balance)}
                                    >
                                        Edit Balance
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )

    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (activeSection === 'orders') {
            fetchOrders()
        }
    }, [activeSection])

    const fetchOrders = async () => {
        try {
            // Fetch orders with all columns
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    }

    const renderOrders = () => {
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
                                <th style={{ padding: 'var(--space-3)' }}>Total</th>
                                <th style={{ padding: 'var(--space-3)' }}>Status</th>
                                <th style={{ padding: 'var(--space-3)' }}>Fulfillment</th>
                                <th style={{ padding: 'var(--space-3)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>No orders found.</td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: 'var(--space-3)' }}>#{order.id}</td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            {order.shipping_address?.name || 'Guest'}
                                            <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-3)' }}>{order.total_amount} 🪙</td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            {/* Show link for first item if available */}
                                            {order.items && order.items.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                    {order.items.map((item, idx) => (
                                                        item.source_link && (
                                                            <a
                                                                key={idx}
                                                                href={item.source_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline"
                                                                title={item.name}
                                                            >
                                                                <i className="fas fa-external-link-alt"></i> Buy {item.name.substring(0, 10)}...
                                                            </a>
                                                        )
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            <button className="btn btn-outline btn-sm" onClick={() => alert(`Details: \n${JSON.stringify(order.items, null, 2)}`)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
