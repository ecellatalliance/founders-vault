
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydusbkvnkxtfudleiukk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkCategories() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('category')

        if (error) throw error

        const categories = [...new Set(data.map(p => p.category))]
        console.log('Unique Categories in DB:', categories)
    } catch (err) {
        console.error('Error:', err.message)
    }
}

checkCategories()
