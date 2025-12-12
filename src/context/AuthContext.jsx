import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

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
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setIsLoading(false)
            }
        }).catch(err => {
            console.error('Session check failed:', err)
            setIsLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setUser(null)
                setIsLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (authUser) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (data) {
                setUser({ ...authUser, ...data }) // Merge auth data with profile data
            } else {
                // Return basic user if profile missing (shouldn't happen if flow is correct)
                setUser(authUser)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return { success: false, error: error.message }
        }
        return { success: true }
    }

    const register = async (userData) => {
        // 1. Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name
                }
            }
        })

        if (authError) {
            return { success: false, error: authError.message }
        }

        if (authData.user) {
            // 2. Create profile in 'profiles' table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        email: userData.email,
                        name: userData.name,
                        vc_balance: 5000, // Default signup bonus
                        is_admin: false
                    }
                ])

            if (profileError) {
                console.error('Error creating profile:', profileError)
                return { success: true, warning: 'Account created but profile setup failed.' }
            }
        }

        return { success: true }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error logging out:', error)
        setUser(null)
    }

    const updateVCBalance = async (amount) => {
        if (!user) return

        const newBalance = (user.vc_balance || 0) + amount

        // Optimistic update
        setUser(prev => ({ ...prev, vc_balance: newBalance }))

        const { error } = await supabase
            .from('profiles')
            .update({ vc_balance: newBalance })
            .eq('id', user.id)

        if (error) {
            console.error('Error updating VC balance:', error)
            // Revert on error? For now just log.
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
