import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [wishlist, setWishlist] = useState([])
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && user) {
            // Load from DB if available (assuming profile has cart/wishlist columns)
            if (user.cart) setCart(user.cart)
            if (user.wishlist) setWishlist(user.wishlist)
        } else {
            // Load from localStorage
            const savedCart = localStorage.getItem('spp_cart')
            const savedWishlist = localStorage.getItem('spp_wishlist')

            if (savedCart) setCart(JSON.parse(savedCart))
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
        }
    }, [isAuthenticated, user])

    const saveCart = async (newCart) => {
        localStorage.setItem('spp_cart', JSON.stringify(newCart))
        if (isAuthenticated && user) {
            try {
                await supabase.from('profiles').update({ cart: newCart }).eq('id', user.id)
            } catch (err) {
                console.error("Failed to sync cart to DB (ensure 'cart' column exists):", err)
            }
        }
    }

    const saveWishlist = async (newWishlist) => {
        localStorage.setItem('spp_wishlist', JSON.stringify(newWishlist))
        if (isAuthenticated && user) {
            try {
                await supabase.from('profiles').update({ wishlist: newWishlist }).eq('id', user.id)
            } catch (err) {
                console.error("Failed to sync wishlist to DB (ensure 'wishlist' column exists):", err)
            }
        }
    }

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id)

            let newCart
            if (existingItem) {
                newCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                newCart = [...prevCart, { ...product, quantity }]
            }

            saveCart(newCart)
            return newCart
        })
    }

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== productId)
            saveCart(newCart)
            return newCart
        })
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setCart(prevCart => {
            const newCart = prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
            saveCart(newCart)
            return newCart
        })
    }

    const clearCart = () => {
        setCart([])
        saveCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    // Wishlist functions
    const addToWishlist = (product) => {
        setWishlist(prevWishlist => {
            if (prevWishlist.find(item => item.id === product.id)) {
                return prevWishlist
            }
            const newWishlist = [...prevWishlist, product]
            saveWishlist(newWishlist)
            return newWishlist
        })
    }

    const removeFromWishlist = (productId) => {
        setWishlist(prevWishlist => {
            const newWishlist = prevWishlist.filter(item => item.id !== productId)
            saveWishlist(newWishlist)
            return newWishlist
        })
    }

    const toggleWishlist = (product) => {
        if (wishlist.find(item => item.id === product.id)) {
            removeFromWishlist(product.id)
        } else {
            addToWishlist(product)
        }
    }

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId)
    }

    const clearWishlist = () => {
        setWishlist([])
        saveWishlist([])
    }

    const value = {
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
