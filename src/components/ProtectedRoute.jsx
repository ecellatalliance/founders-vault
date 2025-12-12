
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="loading-spinner"></div>
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return children
}

export default ProtectedRoute
