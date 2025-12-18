import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Vaultie from './Vaultie';
import CategoryMenu from './CategoryMenu';
import SearchBar from './SearchBar';
import CategoryContext from '../context/CategoryContext';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, User, LogOut, Heart, Sun, Moon, Users, Menu } from 'lucide-react';
import ecellLogo from '../assets/ecell_logo.png';

const Layout = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useShop();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Don't show layout on login page
    if (location.pathname === '/login') {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center gap-4">
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu Button */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Open menu"
                            >
                                <Menu size={24} />
                            </button>

                            <Link to="/" className="flex items-center gap-2">
                                <img src={ecellLogo} alt="E-Cell Logo" className="h-12 w-auto object-contain" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <SearchBar onSearch={setSearchTerm} />

                        <div className="flex items-center gap-6">
                            <Link to="/shop" className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white font-medium transition-colors">Shop</Link>
                            <Link to="/community" className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white font-medium transition-colors flex items-center gap-1">
                                <Users size={18} /> Community
                            </Link>
                            {user && (
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white font-medium transition-colors">Dashboard</Link>
                            )}
                            {user && user.isAdmin && (
                                <Link to="/admin" className="text-red-600 hover:text-red-800 font-semibold transition-colors">Admin</Link>
                            )}

                            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-700">
                                <button onClick={toggleTheme} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>

                                {user ? (
                                    <>
                                        <Link to="/wishlist" className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Heart size={20} />
                                        </Link>
                                        <Link to="/cart" className="text-slate-400 hover:text-black dark:hover:text-white transition-colors relative">
                                            <ShoppingCart size={20} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                            <span className="text-sm font-semibold text-yellow-600">🪙 {user.balance}</span>
                                        </div>
                                        <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <LogOut size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">Login</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Category Menu */}
            <CategoryMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onSelectCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, searchTerm }}>
                    <Outlet />
                </CategoryContext.Provider>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
                    <p>© 2025 The Founders Vault. Built for Builders.</p>
                    <div className="flex items-center gap-6">
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors font-medium">LinkedIn</a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors font-medium">Instagram</a>
                    </div>
                </div>
            </footer>

            <Vaultie />
        </div>
    );
};

export default Layout;
