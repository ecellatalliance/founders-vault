# 🚀 E-Cell Store - React Version

A modern React rebuild of the E-Cell Store with **exact UI/UX matching** the vanilla JavaScript version.

## ✨ What's New

This React version maintains **100% visual parity** with the vanilla version while adding:
- ⚡ **Faster navigation** (Single Page Application)
- 🔄 **Better state management** (React Context API)
- 🎨 **Same beautiful UI** (Original CSS preserved)
- 📦 **Component-based** (Easier to maintain)
- 🚀 **Vite dev server** (Lightning-fast HMR)

## 🎯 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at **http://localhost:3000**

### 3. Build for Production
```bash
npm run build
```

## 🔐 Demo Accounts

### Student Account
- **Email**: `student@ecell.com`
- **Password**: `password`
- **VC Balance**: 5000🪙

### Admin Account
- **Email**: `admin@ecell.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard

## 📸 UI Features (Matching Vanilla Version)

### ✅ Header
- Logo with E-Cell branding
- Search bar with live search
- VC balance display
- Wishlist & Cart counters
- User authentication status
- Dark/Light theme toggle

### ✅ Category Icon Bar
- Best Sellers
- New Arrivals
- Express Shipping
- Sale
- Home Hacks
- Top 100
- Bottles & Sippers
- Storage & Organizers

### ✅ Hero Carousel
- Auto-rotating slides (5 seconds)
- "WEAR THE VIBE" style layout
- Product images on left
- Bold typography on right
- Navigation arrows & dots

### ✅ Product Carousels
- ⭐ Top Picks for Students
- Products Under 300🪙
- Products 301-1000🪙
- Premium Products (1000🪙+)
- Student Startup Collection
- Horizontal scrolling
- "View All" links

### ✅ Promotional Cards
- Tech Essentials (Purple gradient)
- Premium Apparel (Pink gradient)
- Student Startups (Blue gradient)
- Earn VC Cards (Win, Register, Refer)

### ✅ Product Cards
- Product image with hover effects
- Discount badge
- Wishlist heart icon
- Star ratings
- Price with strikethrough
- Add to Cart button

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Header with category icon bar
│   ├── Footer.jsx           # Site footer
│   ├── Layout.jsx           # Page wrapper
│   ├── HeroCarousel.jsx     # Hero image carousel
│   ├── ProductCarousel.jsx  # Horizontal product carousel
│   └── ProductCard.jsx      # Product display card
├── context/
│   ├── AuthContext.jsx      # User authentication
│   ├── CartContext.jsx      # Cart & wishlist
│   └── ThemeContext.jsx     # Dark/light mode
├── pages/
│   ├── Home.jsx             # Homepage with carousels
│   ├── Shop.jsx             # Product listing
│   ├── Login.jsx            # Authentication
│   ├── Dashboard.jsx        # User profile
│   ├── Cart.jsx             # Shopping cart
│   ├── Wishlist.jsx         # Saved products
│   ├── Community.jsx        # Announcements
│   └── Admin.jsx            # Admin panel
├── styles/                  # Original vanilla CSS
│   ├── theme.css
│   ├── main.css
│   └── hero-carousel.css
├── App.jsx                  # Main app with routing
├── main.jsx                 # React entry point
└── index.css                # CSS imports
```

## 🎨 Styling

This project uses the **original vanilla CSS files** to ensure 100% visual consistency:

- `theme.css` - CSS variables and theming
- `main.css` - Component styles
- `hero-carousel.css` - Hero carousel animations

**No Tailwind CSS** - We're using the original custom CSS for exact UI matching!

## 🔧 Technologies

- **React 18** - UI library
- **Vite** - Build tool (fast HMR)
- **React Router** - Client-side routing
- **React Context** - State management
- **Original CSS** - Vanilla styles preserved
- **Font Awesome** - Icons
- **Google Fonts** - Inter & Oswald

## 📱 Pages

1. **Home** (`/`) - Hero carousel, product carousels, promo cards
2. **Shop** (`/shop`) - All products with filtering
3. **Login** (`/login`) - Authentication
4. **Dashboard** (`/dashboard`) - User profile
5. **Cart** (`/cart`) - Shopping cart
6. **Wishlist** (`/wishlist`) - Saved products
7. **Community** (`/community`) - Announcements
8. **Admin** (`/admin`) - Admin dashboard

## 🌐 Deployment

### GitHub Pages
1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/your-repo-name/',
     plugins: [react()]
   })
   ```
2. Build: `npm run build`
3. Deploy the `dist` folder

### Vercel/Netlify
- Connect your repository
- Automatic deployments on push
- No configuration needed!

## 🔄 Differences from Vanilla Version

| Aspect | Vanilla | React |
|--------|---------|-------|
| **UI/UX** | ✅ Original | ✅ **Exact Match** |
| **Navigation** | Page reloads | Instant (SPA) |
| **State** | localStorage + globals | React Context |
| **Components** | Copy-paste HTML | Reusable React |
| **Dev Server** | Python/Node | Vite (HMR) |
| **Build** | None | Optimized bundle |

## 📝 Notes

- **Original CSS preserved** - All vanilla styles imported
- **Same visual design** - Hero carousel, product carousels, promo cards
- **Same interactions** - Hover effects, animations, transitions
- **Better performance** - React's virtual DOM + Vite's HMR
- **Easier maintenance** - Component-based architecture

## 🎓 E-Cell Store

Built for students, by students. Support student entrepreneurs and get exclusive deals!

---

**Made with ❤️ by E-Cell**

**Note**: Your original vanilla files are safely preserved in the `vanilla_backup/` folder!
