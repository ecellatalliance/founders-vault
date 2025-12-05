import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Community from './pages/Community'
import Admin from './pages/Admin'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
