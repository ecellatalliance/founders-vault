
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated && user?.isAdmin) {
            navigate('/admin')
        }
    }, [isAuthenticated, user, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        const result = await login(email, password)
        if (result.success) {
            // Check if admin after login (might need a slight delay or check result context if we modified login to return user)
            // But the useEffect should catch it if the auth state updates quickly.
            // For now, let the useEffect handle the redirection.
        } else {
            alert('Login failed: ' + result.message)
        }
    }

    return (
        <Layout>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-header">
                        <div className="login-logo">
                            <i className="fas fa-user-shield" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                        </div>
                        <h1 className="login-title">Admin Access</h1>
                        <p className="login-subtitle">Restricted Area. Authorized Personnel Only.</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Admin Email</label>
                            <div className="form-input-wrapper">
                                <i className="fas fa-envelope form-icon"></i>
                                <input
                                    type="email"
                                    className="input form-input"
                                    placeholder="admin@ecell.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="form-input-wrapper">
                                <i className="fas fa-lock form-icon"></i>
                                <input
                                    type="password"
                                    className="input form-input"
                                    placeholder="Admin Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#dc2626' }}>
                            <i className="fas fa-lock"></i> Secure Login
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default AdminLogin
