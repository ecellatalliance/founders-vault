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
import EarnVC from './pages/EarnVC'
import Admin from './pages/Admin'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/AdminLogin'


import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/earn-vc" element={<EarnVC />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/admin-login" element={<AdminLogin />} />
                            <Route path="/product/:id" element={<ProductDetails />} />

                            {/* Protected Routes */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/cart" element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path="/wishlist" element={
                                <ProtectedRoute>
                                    <Wishlist />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            } />
                            <Route path="/checkout" element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            } />

                        </Routes>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
