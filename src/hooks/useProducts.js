
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export const useProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')

            if (error) throw error

            const dataToMap = data || []

            // Map DB fields to frontend expected format
            const mappedProducts = dataToMap.map(p => ({
                ...p,
                image: p.image_url, // UI expects 'image'
                originalPrice: p.price * 1.5, // Mock original price for now as it wasn't in DB schema
                rating: 4.5, // Mock rating
                features: p.features || [], // Ensure array
                colors: ['#000', '#aaa'] // Mock colors
            }))

            setProducts(mappedProducts)
        } catch (err) {
            console.error('Error fetching products:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { products, loading, error, refetch: fetchProducts }
}
