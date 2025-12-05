import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('spp_theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light'
            localStorage.setItem('spp_theme', newTheme)
            document.documentElement.setAttribute('data-theme', newTheme)
            return newTheme
        })
    }

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
