import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

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

    // Load mock data
    loadMockData()
  }, [isAuthenticated, navigate])

  const loadMockData = () => {
    // Mock badges
    const mockBadges = [
      { icon: '🎓', name: 'First Purchase', description: 'Made your first order' },
      { icon: '🏆', name: 'Top Shopper', description: 'Spent over 1000 VC' },
      { icon: '⭐', name: 'Early Adopter', description: 'Joined in the first month' }
    ]
    setBadges(mockBadges)

    // Mock orders
    const mockOrders = [
      {
        id: 'ORD12345',
        date: new Date(Date.now() - 86400000 * 2),
        status: 'completed',
        total: 450,
        items: 3
      },
      {
        id: 'ORD12346',
        date: new Date(Date.now() - 86400000 * 5),
        status: 'processing',
        total: 890,
        items: 2
      }
    ]
    setOrders(mockOrders)
  }

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
                  <Link to="/shop" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Start Shopping</Link>
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
                        <div className="order-id">Order #{order.id}</div>
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
                  <Link to="/shop" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Browse Products</Link>
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
