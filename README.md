# Founders Vault - E-Cell Store

A modern, responsive e-commerce platform for E-Cell built with React, Vite, and tailored for a premium user experience.

## 🚀 Features

- **Student & Admin Portals**: Dedicated interfaces for students to shop and admins to manage the platform.
- **Premium UI/UX**: Designed with a "Space/Innovation" theme using modern CSS, glassmorphism, and smooth animations.
- **Dark/Light Mode**: Fully supported theme toggling with persistent preferences.
- **Functionality**:
  - **Authentication**: Login and Registration system (currently using LocalStorage for demo).
  - **Shopping**: Product browsing, filtering by category/price.
  - **Cart & Wishlist**: Fully functional cart management and wishlist marking.
  - **Admin Dashboard**: Overview of sales and quick statistics.

## 🛠️ Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v16 or higher) installed. [Download Node.js](https://nodejs.org/)

### Steps
1. **Clone or Download** the repository to your local machine.
2. Open the project folder in VS Code or your terminal.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. Click the link shown in the terminal (usually `http://localhost:5173` or `http://localhost:3000`) to open the app.

---

## 🔐 Login Credentials

The application comes with built-in demo logic. You can use the "Quick Demo Login" buttons on the login page, or use these credentials manually:

### Student Login
- **Email**: `student@ecell.com`
- **Password**: `password`
- **Access**: Shop, Cart, Wishlist, Profile.

### Admin Login
- **Email**: `admin@ecell.com`
- **Password**: `admin123`
- **Access**: Full Admin Dashboard, Manage Products, Users, etc.

---

## 🌐 How to Host on Hostinger (Frontend)

To make your website live on the internet using Hostinger:

1. **Build the Project**:
   Run the build command to generate a production-ready folder.
   ```bash
   npm run build
   ```
   This will create a `dist` folder in your project directory.

2. **Upload to Hostinger**:
   - Log in to your Hostinger hPanel.
   - Go to **File Manager** (usually under "Files").
   - Navigate to the `public_html` folder.
   - Delete the default `default.php` or `index.php` if present.
   - **Upload** all the *contents* of your local `dist` folder directly into `public_html`. (Do not upload the `dist` folder itself, just the files inside it like `index.html`, `assets/`, etc.).

3. **Configure fallback for React Router**:
   Since this is a Single Page Application (SPA), you need to tell the server to redirect all requests to `index.html`.
   - In `public_html`, create a new file named `.htaccess`.
   - Paste the following code into it:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

---

## ⚡ Connecting to Supabase (Backend)

Currently, this app uses `localStorage` to simulate a database. To make it a real app, you should connect it to **Supabase** (an open-source Firebase alternative).

### Estimated Cost
- **Frontend (Hostinger)**: ~$3.00/month (Basic Web Hosting).
- **Backend (Supabase)**: **Free** (Generous free tier includes 500MB database, sufficient for thousands of products/users).

### Integration Steps

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API.

2. **Install Client Library**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Initialize Client**:
   Create a file `src/supabaseClient.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

4. **Migrate AuthContext**:
   Modify `src/context/AuthContext.jsx` to use Supabase Auth instead of LocalStorage.
   ```javascript
   // Example Login
   const { data, error } = await supabase.auth.signInWithPassword({
     email: email,
     password: password,
   })
   ```

5. **Migrate Data**:
   - Create tables in Supabase (e.g., `products`, `orders`).
   - Import your `products.json` data into the Supabase `products` table.
   - Update `Home.jsx` to fetch from Supabase:
     ```javascript
     const { data: products } = await supabase.from('products').select('*')
     ```

This setup gives you a professional, scalable, and low-cost architecture!
