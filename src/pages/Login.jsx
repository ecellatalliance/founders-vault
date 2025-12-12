import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
        }
    }, [isAuthenticated, navigate, redirect])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const result = await login(formData.email, formData.password)
        if (result.success) {
            navigate(redirect)
        } else {
            alert(result.message)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <div className="login-logo-icon">🚀</div>
                        <div className="login-logo-text">Founders Vault</div>
                    </div>
                    <h1 className="login-title">Welcome Back!</h1>
                    <p className="login-subtitle">Login to access exclusive student deals</p>
                </div>

                {/* Login Form Only */}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="form-input-wrapper">
                            <i className="fas fa-envelope form-icon"></i>
                            <input
                                type="email"
                                className="input form-input"
                                name="email"
                                placeholder="student@college.edu"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
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
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <i className="fas fa-sign-in-alt"></i>
                        Login
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                        <Link to="/" className="back-link">
                            <i className="fas fa-arrow-left"></i>
                            Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
