
import { createClient } from '@supabase/supabase-js'

// Hardcoded for now since .env write was blocked by gitignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydusbkvnkxtfudleiukk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
