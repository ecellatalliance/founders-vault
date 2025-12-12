
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydusbkvnkxtfudleiukk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearProducts() {
    console.log('🗑️ Attempting to delete all products...')

    const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0) // Delete all where ID is not 0 (which is all of them)

    if (error) {
        console.error('❌ Error deleting products:', error.message)
        console.log('💡 Note: If RLS is enabled, you might need to delete them via the Supabase Dashboard.')
    } else {
        console.log('✅ All products removed successfully!')
    }
}

clearProducts()
