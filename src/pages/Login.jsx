import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [activeTab, setActiveTab] = useState('login')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        college: '',
        phone: ''
    })
    const { login, register, isAuthenticated } = useAuth()
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

    const handleRegister = async (e) => {
        e.preventDefault()
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            college: formData.college,
            phone: formData.phone
        })
        if (result.success) {
            navigate(redirect)
        } else {
            alert(result.message)
        }
    }

    const handleQuickLogin = async (type) => {
        const credentials = {
            student: { email: 'student@ecell.com', password: 'password' },
            admin: { email: 'admin@ecell.com', password: 'admin123' }
        }
        const cred = credentials[type]
        const result = await login(cred.email, cred.password)
        if (result.success) {
            if (type === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
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

                <div className="login-tabs">
                    <button
                        className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
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
                    </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                    <form className="login-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="form-input-wrapper">
                                <i className="fas fa-user form-icon"></i>
                                <input
                                    type="text"
                                    className="input form-input"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

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
                            <label className="form-label">College/University</label>
                            <div className="form-input-wrapper">
                                <i className="fas fa-graduation-cap form-icon"></i>
                                <input
                                    type="text"
                                    className="input form-input"
                                    name="college"
                                    placeholder="Your College Name"
                                    required
                                    value={formData.college}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div className="form-input-wrapper">
                                <i className="fas fa-phone form-icon"></i>
                                <input
                                    type="tel"
                                    className="input form-input"
                                    name="phone"
                                    placeholder="+91 98765 43210"
                                    required
                                    value={formData.phone}
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
                                    placeholder="Create a password"
                                    required
                                    minLength="6"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <i className="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </form>
                )}

                {/* Demo Accounts */}
                <div className="demo-accounts">
                    <div className="demo-accounts-title">
                        <i className="fas fa-info-circle"></i>
                        Quick Demo Login
                    </div>

                    <button className="demo-btn" onClick={() => handleQuickLogin('student')}>
                        <i className="fas fa-user-graduate"></i>
                        Login as Student
                    </button>

                    <button className="demo-btn" onClick={() => handleQuickLogin('admin')}>
                        <i className="fas fa-user-shield"></i>
                        Login as Admin
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                        <Link to="/" className="back-link">
                            <i className="fas fa-arrow-left"></i>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
