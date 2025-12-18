import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Community from './pages/Community';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ShopProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<Layout />}>
                <Route index element={<Marketplace />} />
                <Route path="home" element={<Home />} />
                <Route path="shop" element={<Marketplace />} />
                <Route path="community" element={<Community />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="admin" element={<Admin />} />
                <Route path="cart" element={<Cart />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </ShopProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
