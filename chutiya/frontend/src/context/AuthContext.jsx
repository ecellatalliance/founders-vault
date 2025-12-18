import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage (Simulated persistence)
        const savedUser = localStorage.getItem('founder_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('founder_user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: 'Server Error' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('founder_user');
        window.location.href = '/login';
    };

    const refreshUser = async () => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}`);
            const updatedUser = await res.json();
            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem('founder_user', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error("Failed to refresh user", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
