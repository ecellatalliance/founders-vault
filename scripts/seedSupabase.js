
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SUPABASE_URL = 'https://ydusbkvnkxtfudleiukk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdXNia3Zua3h0ZnVkbGVpdWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzA0OTIsImV4cCI6MjA4MTEwNjQ5Mn0.tXjLiPP35pHA0jMLGwC7DiG_RshetgnbTB6_fQEVvWs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedProducts() {
    console.log('Starting migration...')

    try {
        const jsonPath = path.join(__dirname, '../public/data/products.json')
        const rawData = fs.readFileSync(jsonPath, 'utf8')
        const products = JSON.parse(rawData)

        console.log(`Found ${products.length} products to migrate.`)

        let successCount = 0
        let failCount = 0

        for (const product of products) {
            // Transform data to match schema
            // JSON: { id: "prod_017", name, price, originalPrice, description, image, category, stock, ... }
            // DB: { name, description, price, category, image_url, stock } 
            // Note: DB 'id' is bigint/identity, so we check if we should map old ID or let DB generate new one.
            // Since old IDs are strings ('prod_017'), we can't put them in bigint 'id'.
            // We will let Supabase generate new IDs.

            const dbProduct = {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image_url: product.image,
                stock: product.stock
            }
            // Optional: originalPrice, rating, reviews are not in the simple schema I gave earlier.
            // If the user ran the exact SQL I provided, those columns don't exist.
            // I should stick to the schema I provided: name, description, price, category, image_url, stock.

            const { error } = await supabase
                .from('products')
                .insert([dbProduct])

            if (error) {
                console.error(`Failed to insert ${product.name}:`, error.message)
                failCount++
            } else {
                process.stdout.write('.')
                successCount++
            }
        }

        console.log('\nMigration complete!')
        console.log(`Successfully migrated: ${successCount}`)
        console.log(`Failed: ${failCount}`)

    } catch (err) {
        console.error('Migration failed:', err)
    }
}

seedProducts()
