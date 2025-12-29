import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { supabase } from '../supabaseClient'
import '../styles/dashboard.css'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [badges, setBadges] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/dashboard')
      return
    }

    // Load real data
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id) // Filter by current user
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        // Format orders from DB
        const formattedOrders = (ordersData || []).map(order => ({
          id: order.id,
          date: new Date(order.created_at),
          status: order.status || 'pending',
          approval_status: order.approval_status || 'pending_approval',
          pickup_date: order.pickup_date ? new Date(order.pickup_date) : null,
          pickup_location: order.pickup_location,
          total: order.total_amount,
          items: order.items ? order.items.length : 0,
          _items: order.items
        }))
        setOrders(formattedOrders)

        // Badges - Placeholder for now or fetch if table exists
        setBadges([
          { icon: '🎓', name: 'Member', description: 'Joined the Founders Vault' }
        ])

      } catch (error) {
        console.error("Error loading dashboard:", error)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated, navigate, user])

  if (!isAuthenticated) return null

  return (
    <Layout>
      <main className="dashboard-main">
        <div className="container">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="dashboard-header-content">
              <h1 className="dashboard-welcome">Welcome Back, {user?.name?.split(' ')[0]}!</h1>
              <p className="dashboard-subtitle">Manage your account, track orders, and earn more VC</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <i className="fas fa-coins"></i>
                </div>
              </div>
              <h3 className="stat-card-title">Venture Credits</h3>
              <div className="stat-card-value">{user?.vcBalance || 0} 🪙</div>
              <div className="stat-card-change">
                <i className="fas fa-arrow-up"></i>
                <span>Available Balance</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
              </div>
              <h3 className="stat-card-title">Total Orders</h3>
              <div className="stat-card-value">{orders.length}</div>
              <div className="stat-card-change">
                <i className="fas fa-chart-line"></i>
                <span>All time purchases</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <i className="fas fa-trophy"></i>
                </div>
              </div>
              <h3 className="stat-card-title">Badges Earned</h3>
              <div className="stat-card-value">{badges.length}</div>
              <div className="stat-card-change">
                <i className="fas fa-star"></i>
                <span>Achievements unlocked</span>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-user-circle"></i>
                Profile Information
              </h2>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            </div>
            <div className="profile-grid">
              <div className="profile-item">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{user?.name}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email Address</span>
                <span className="profile-value">{user?.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Account Status</span>
                <span className="profile-value" style={{ color: 'var(--success)' }}>
                  <i className="fas fa-check-circle"></i> Active
                </span>
              </div>
            </div>
          </section>

          {/* Badges Section */}
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-medal"></i>
                My Badges
              </h2>
            </div>
            <div className="badge-grid">
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div key={index} className="badge-item">
                    <div className="badge-icon">{badge.icon}</div>
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-description">{badge.description}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-trophy"></i>
                  <p>No badges earned yet</p>
                  <Link to="/shop" className="btn btn-primary btn-sm">Start Shopping</Link>
                </div>
              )}
            </div>
          </section>

          {/* Order History */}
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-history"></i>
                Order History
              </h2>
              <Link to="/shop" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <i className="fas fa-plus"></i>
                New Order
              </Link>
            </div>
            <div>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <div>
                        <div className="order-id">
                          Order #{order.id}
                          {order.approval_status === 'approved' && (
                            <span className="badge badge-success" style={{ marginLeft: '10px', fontSize: '0.7em', padding: '2px 6px' }}>Ready for Pickup</span>
                          )}
                        </div>
                        <div className="order-date">
                          {order.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className={`order-status status-${order.status}`}>{order.status}</span>
                    </div>

                    {/* Pickup Details */}
                    {order.approval_status === 'approved' && order.pickup_date && (
                      <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '2px', color: '#059669' }}>
                          <i className="fas fa-check-circle"></i> Approved for Pickup
                        </div>
                        <div>
                          <strong>When:</strong> {order.pickup_date.toLocaleString()}
                        </div>
                        <div>
                          <strong>Where:</strong> {order.pickup_location}
                        </div>
                      </div>
                    )}
                    {(order.approval_status === 'pending_approval' || !order.approval_status) && (
                      <div style={{ marginTop: 'var(--space-2)', fontSize: '0.9rem', color: '#d97706' }}>
                        <i className="fas fa-clock"></i> Waiting for Admin Approval...
                      </div>
                    )}

                    <div className="order-details">
                      <div className="order-total">{order.total} 🪙</div>
                      <div className="order-items">{order.items} item(s)</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-shopping-bag"></i>
                  <p>No orders yet</p>
                  <Link to="/shop" className="btn btn-primary btn-sm">Browse Products</Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

export default Dashboard
