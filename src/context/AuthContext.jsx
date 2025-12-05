import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for saved user in localStorage
        const savedUser = localStorage.getItem('spp_user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (email, password) => {
        // Mock login - in production, this would call an API
        const users = JSON.parse(localStorage.getItem('spp_users') || '[]')
        const foundUser = users.find(u => u.email === email && u.password === password)

        if (foundUser) {
            const userWithoutPassword = { ...foundUser }
            delete userWithoutPassword.password
            setUser(userWithoutPassword)
            localStorage.setItem('spp_user', JSON.stringify(userWithoutPassword))
            return { success: true }
        }

        return { success: false, error: 'Invalid credentials' }
    }

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('spp_users') || '[]')

        // Check if user already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'User already exists' }
        }

        const newUser = {
            id: `user_${Date.now()}`,
            ...userData,
            vcBalance: 5000,
            createdAt: new Date().toISOString(),
            isAdmin: false
        }

        users.push(newUser)
        localStorage.setItem('spp_users', JSON.stringify(users))

        const userWithoutPassword = { ...newUser }
        delete userWithoutPassword.password
        setUser(userWithoutPassword)
        localStorage.setItem('spp_user', JSON.stringify(userWithoutPassword))

        return { success: true }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('spp_user')
    }

    const updateVCBalance = (amount) => {
        if (user) {
            const updatedUser = { ...user, vcBalance: user.vcBalance + amount }
            setUser(updatedUser)
            localStorage.setItem('spp_user', JSON.stringify(updatedUser))
        }
    }

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateVCBalance
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
