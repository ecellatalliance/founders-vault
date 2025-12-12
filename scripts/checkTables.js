
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydusbkvnkxtfudleiukk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
    console.log('Checking tables...')

    const { data: products, error: prodError } = await supabase.from('products').select('id').limit(1)
    console.log('Products table:', prodError ? `Error: ${prodError.message}` : 'Exists')

    const { data: announcements, error: annError } = await supabase.from('announcements').select('id').limit(1)
    console.log('Announcements table:', annError ? `Error: ${annError.message}` : 'Exists')

    const { data: profiles, error: profError } = await supabase.from('profiles').select('id').limit(1)
    console.log('Profiles table:', profError ? `Error: ${profError.message}` : 'Exists')
}

checkTables()
