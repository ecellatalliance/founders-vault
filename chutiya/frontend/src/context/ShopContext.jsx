import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const { user, refreshUser } = useAuth();
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (user) {
            setCart(user.cart || []);
            setWishlist(user.wishlist || []);
        } else {
            setCart([]);
            setWishlist([]);
        }
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return alert("Please login first");

        // Optimistic update
        const existingItem = cart.find(item => item.product._id === productId);
        let newQty = quantity;
        if (existingItem) newQty += existingItem.quantity;

        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQty })
            });
            const updatedCart = await res.json();
            setCart(updatedCart);
            refreshUser(); // Sync auth user state
        } catch (err) {
            console.error(err);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity })
            });
            const updatedCart = await res.json();
            setCart(updatedCart);
            refreshUser();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleWishlist = async (product) => {
        if (!user) return alert("Please login first");

        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}/wishlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id })
            });
            const updatedWishlist = await res.json();
            setWishlist(updatedWishlist);
            refreshUser();
        } catch (err) {
            console.error(err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(p => p._id === productId || p === productId);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.cost * item.quantity), 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <ShopContext.Provider value={{
            cart, wishlist, addToCart, updateQuantity, toggleWishlist, isInWishlist, cartTotal, cartCount
        }}>
            {children}
        </ShopContext.Provider>
    );
};
