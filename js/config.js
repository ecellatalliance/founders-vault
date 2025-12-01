// ============================================
// CONFIGURATION - Student Purchase Program
// ============================================

const CONFIG = {
    APP_NAME: 'E-cell Store',
    APP_SUBTITLE: 'Student Marketplace',
    VERSION: '1.0.0',

    // API Endpoints (Mock - using local data)
    API: {
        PRODUCTS: './data/products.json',
        USERS: './data/users.json',
        ORDERS: './data/orders.json',
        ANNOUNCEMENTS: './data/announcements.json'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        CART: 'spp_cart',
        WISHLIST: 'spp_wishlist',
        USER: 'spp_user',
        THEME: 'spp_theme',
        SEARCH_HISTORY: 'spp_search_history'
    },

    // Default Settings
    DEFAULTS: {
        CURRENCY: 'ðŸª™',
        ITEMS_PER_PAGE: 12,
        FREE_SHIPPING_THRESHOLD: 999,
        VC_EARN_RATE: 0.01, // 1% of purchase as VC points
        INITIAL_VC_BALANCE: 5000
    },

    // Categories
    CATEGORIES: [
        'Tech Essentials',
        'Premium Apparel',
        'Student Startups',
        'Office Supplies',
        'Books & Learning'
    ],

    // Price Ranges
    PRICE_RANGES: [
        { label: 'Under 300ðŸª™', min: 0, max: 300 },
        { label: '301ðŸª™ - 1000ðŸª™', min: 301, max: 1000 },
        { label: '1001ðŸª™ - 5000ðŸª™', min: 1001, max: 5000 },
        { label: 'Above 5000ðŸª™', min: 5001, max: Infinity }
    ],

    // Sort Options
    SORT_OPTIONS: [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'newest', label: 'Newest First' }
    ],

    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    },

    // Toast Duration
    TOAST_DURATION: 3000,

    // Animation Delays
    ANIMATION_DELAY: 150
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

