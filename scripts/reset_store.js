
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const supabaseUrl = 'https://ydusbkvnkxtfudleiukk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function resetStore() {
    console.log('🗑️ Clearing all products from database...')

    // Delete all records from 'products' table
    // We use a filter like id > 0 (assuming ids are positive integers) to match all rows for deletion
    const { error } = await supabase
        .from('products')
        .delete()
        .gt('id', 0)

    if (error) {
        console.error('❌ Error clearing products:', error.message)
    } else {
        console.log('✅ All products cleared successfully!')
    }
}

resetStore()
