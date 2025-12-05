import { createContext, useContext, useState, useEffect } from 'react'

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

    useEffect(() => {
        // Load cart and wishlist from localStorage
        const savedCart = localStorage.getItem('spp_cart')
        const savedWishlist = localStorage.getItem('spp_wishlist')

        if (savedCart) setCart(JSON.parse(savedCart))
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    }, [])

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

            localStorage.setItem('spp_cart', JSON.stringify(newCart))
            return newCart
        })
    }

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== productId)
            localStorage.setItem('spp_cart', JSON.stringify(newCart))
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
            localStorage.setItem('spp_cart', JSON.stringify(newCart))
            return newCart
        })
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem('spp_cart')
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
            localStorage.setItem('spp_wishlist', JSON.stringify(newWishlist))
            return newWishlist
        })
    }

    const removeFromWishlist = (productId) => {
        setWishlist(prevWishlist => {
            const newWishlist = prevWishlist.filter(item => item.id !== productId)
            localStorage.setItem('spp_wishlist', JSON.stringify(newWishlist))
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
        localStorage.removeItem('spp_wishlist')
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
