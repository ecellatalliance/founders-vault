import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { supabase } from '../supabaseClient'
import SearchableDropdown from '../components/SearchableDropdown'

const Admin = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('dashboard')

    // Ref to track active section inside effect without re-subscribing
    const activeSectionRef = useRef(activeSection)
    useEffect(() => {
        activeSectionRef.current = activeSection
    }, [activeSection])

    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        activeProducts: 0,
        ordersToday: 0,
        usersToday: 0,
        salesThisWeek: 0
    })

    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [announcements, setAnnouncements] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [approvalDetails, setApprovalDetails] = useState({ date: '', location: 'Founders Vault Desk' })
    const [newProductCategory, setNewProductCategory] = useState('')

    // Derive detailed unique categories from products
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean).sort()

    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            navigate('/dashboard')
            return
        }

        // Initial Fetch
        fetchStats()

        if (activeSection === 'users') {
            fetchUsers()
        }
        if (activeSection === 'announcements') {
            fetchAnnouncements()
        }
        if (activeSection === 'orders') {
            fetchOrders()
            // Added explicit fetch here because the generic useEffect below might miss initial load if I rely solely on section change
            // Actually, the original code had activeSection check in the effect dep array.
        }
        if (activeSection === 'products') {
            fetchProducts()
        }
    }, [isAuthenticated, user, navigate, activeSection])

    const fetchStats = async () => {
        try {
            // Helper Dates
            const now = new Date()

            // Start of Today (00:00:00)
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const startOfTodayISO = startOfToday.toISOString()

            // Start of This Week (Monday)
            const day = now.getDay() // 0 (Sun) to 6 (Sat)
            const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
            const startOfWeek = new Date(now.setDate(diff))
            startOfWeek.setHours(0, 0, 0, 0)
            const startOfWeekISO = startOfWeek.toISOString()

            // 1. Total Orders & Sales
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('total_amount, id, created_at')

            if (ordersError) throw ordersError

            const totalOrders = ordersData.length
            const totalSales = ordersData.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)

            // Calculations for "Today" and "This Week"
            const ordersToday = ordersData.filter(o => o.created_at >= startOfTodayISO).length

            // "Sales This Week" - Sum of total_amount for orders created since start of week
            const salesThisWeek = ordersData
                .filter(o => o.created_at >= startOfWeekISO)
                .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)


            // 2. Total Users
            const { count: usersCount, error: usersError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            if (usersError) throw usersError

            // New Users Today
            const { count: usersTodayCount, error: usersTodayError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfTodayISO)

            if (usersTodayError) throw usersTodayError


            // 3. Active Products
            const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })

            if (productsError) throw productsError

            setStats({
                totalSales,
                totalOrders,
                totalUsers: usersCount || 0,
                activeProducts: productsCount || 0,
                ordersToday,
                usersToday: usersTodayCount || 0,
                salesThisWeek
            })
        } catch (error) {
            console.error("Error fetching admin stats:", error)
        }
    }

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
                        <i className="fas fa-chart-line"></i>
                        <span>{stats.salesThisWeek} 🪙 this week</span>
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
                        <i className="fas fa-plus"></i>
                        <span>+{stats.ordersToday} new today</span>
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
                        <span>+{stats.usersToday} new today</span>
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
            category: newProductCategory, // Use state value
            image_url: form.image_url.value,
            source_link: form.source_link.value, // Added source link
            stock: parseInt(form.stock.value),

            badge_text: form.badge_text.value, // Added badge text
            features: form.features.value.split(',').map(f => f.trim())
        }

        try {
            const { error } = await supabase.from('products').insert([productData])
            if (error) throw error
            alert('✅ Product added successfully!')
            form.reset()
            setNewProductCategory('') // Reset category
            fetchProducts()
            fetchStats()
        } catch (error) {
            console.error('Error adding product:', error)
            alert('Error adding product: ' + error.message)
        }
    }



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
                            <SearchableDropdown
                                label="Category"
                                options={uniqueCategories}
                                value={newProductCategory}
                                onChange={setNewProductCategory}
                                placeholder="Select or type category..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input name="image_url" className="form-input" required placeholder="https://..." />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Badge Text (Optional)</label>
                            <input name="badge_text" className="form-input" placeholder="e.g. Bestseller, New Arrival, Audiophile Choice" />
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



    const openApprovalModal = (order) => {
        setSelectedOrder(order)
        const nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)
        nextDay.setHours(12, 0, 0, 0)

        // Adjust for timezone offset for input type="datetime-local" if needed, 
        // but simple toISOString slice is often 'good enough' for local admin if they know it's UTC/Local.
        // Better to use a library or careful manipulation, but keeping it simple:
        // formatting to YYYY-MM-DDTHH:MM
        const localIso = new Date(nextDay.getTime() - (nextDay.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)

        setApprovalDetails({
            date: localIso,
            location: 'Founders Vault Desk (E-Cell Office)'
        })
    }

    const handleApproveOrder = async () => {
        if (!selectedOrder || !approvalDetails.date || !approvalDetails.location) {
            alert('Please fill in all details')
            return
        }

        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'completed',
                    approval_status: 'approved',
                    pickup_date: new Date(approvalDetails.date).toISOString(),
                    pickup_location: approvalDetails.location
                })
                .eq('id', selectedOrder.id)

            if (error) throw error

            alert('Order Approved!')
            setSelectedOrder(null)
            fetchOrders()
        } catch (error) {
            console.error('Error approving order:', error)
            alert('Error approving order: ' + error.message)
        }
    }

    const renderOrders = () => {
        return (
            <section className="section active">
                {/* Modal for Approval */}
                {selectedOrder && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', width: '400px', maxWidth: '90%' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>Approve Order #{selectedOrder.id}</h3>

                            <div className="form-group">
                                <label className="form-label">Pickup Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={approvalDetails.date}
                                    onChange={e => setApprovalDetails({ ...approvalDetails, date: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Pickup Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={approvalDetails.location}
                                    onChange={e => setApprovalDetails({ ...approvalDetails, location: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                                <button className="btn btn-primary" onClick={handleApproveOrder} style={{ flex: 1 }}>Approve</button>
                                <button className="btn btn-outline" onClick={() => setSelectedOrder(null)} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

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
                                <th style={{ padding: 'var(--space-3)' }}>Approval</th>
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
                                            {order.approval_status === 'pending_approval' ? (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                                    onClick={() => openApprovalModal(order)}
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <span className="badge badge-success">{order.approval_status || '-'}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            <button className="btn btn-outline btn-sm" onClick={() => alert(`Details: \n${JSON.stringify(order.items, null, 2)}`)}>
                                                Items
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



    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setAnnouncements(data || [])
        } catch (error) {
            console.error('Error fetching announcements:', error)
        }
    }

    const handleDeleteAnnouncement = async (id) => {
        if (!confirm('Delete this announcement?')) return
        try {
            const { error } = await supabase.from('announcements').delete().eq('id', id)
            if (error) throw error
            setAnnouncements(announcements.filter(a => a.id !== id))
        } catch (error) {
            alert('Error deleting: ' + error.message)
        }
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
            fetchAnnouncements()
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

            {/* List Existing Announcements */}
            <div className="admin-card" style={{ maxWidth: '800px', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Active Announcements</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {announcements.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No announcements yet.</p>
                    ) : (
                        <ul className="list-group">
                            {announcements.map(a => (
                                <li key={a.id} style={{
                                    padding: '10px',
                                    borderBottom: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong>{a.title}</strong> <span className="badge badge-secondary">{a.category}</span>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(a.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(a.id)}
                                        className="btn btn-sm btn-outline"
                                        style={{ color: 'red', borderColor: 'red' }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
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


    // Realtime Subscription (Placed here to ensure all fetch functions are defined)
    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) return

        const handleRealtimeUpdate = (payload) => {
            console.log('Realtime update:', payload)
            // Always refresh stats
            fetchStats()

            // Context-aware refresh
            const table = payload.table
            const currentSection = activeSectionRef.current

            if (table === 'orders' && currentSection === 'orders') fetchOrders()
            if (table === 'products' && currentSection === 'products') fetchProducts()
            if (table === 'profiles' && currentSection === 'users') fetchUsers()
            if (table === 'announcements' && currentSection === 'announcements') fetchAnnouncements()
        }

        const channel = supabase
            .channel('admin-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public' },
                handleRealtimeUpdate
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isAuthenticated, user])

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
