// ============================================
// MAIN APP - E-cell Store Homepage
// ============================================

let allProducts = [];

// ============================================
// Initialize Homepage
// ============================================

async function initHomepage() {
    try {
        // Fetch all products
        allProducts = await fetchProducts();

        if (allProducts.length === 0) {
            showToast('warning', 'No Products', 'No products available at the moment.');
            return;
        }

        // Load different product sections
        loadFeaturedProducts();
        loadProductsByPrice(0, 300, 'under300Carousel');
        loadProductsByPrice(301, 1000, 'mid-rangeCarousel');
        loadProductsByPrice(1001, Infinity, 'premiumCarousel');
        loadProductsByCategory('Student Startups', 'startupsCarousel');

    } catch (error) {
        console.error('Error initializing homepage:', error);
        showToast('error', 'Error', 'Failed to load products. Please refresh the page.');
    }
}

// ============================================
// Load Featured Products
// ============================================

function loadFeaturedProducts() {
    const carousel = document.getElementById('featuredCarousel');
    if (!carousel) return;

    const featuredProducts = allProducts.filter(p => p.featured).slice(0, 10);

    if (featuredProducts.length === 0) {
        carousel.innerHTML = '<p style="padding: var(--space-8); text-align: center; color: var(--text-secondary);">No featured products available.</p>';
        return;
    }

    carousel.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// ============================================
// Load Products by Price Range
// ============================================

function loadProductsByPrice(minPrice, maxPrice, carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const filteredProducts = allProducts
        .filter(p => p.price >= minPrice && p.price <= maxPrice)
        .slice(0, 10);

    if (filteredProducts.length === 0) {
        carousel.innerHTML = '<p style="padding: var(--space-8); text-align: center; color: var(--text-secondary);">No products in this price range.</p>';
        return;
    }

    carousel.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// ============================================
// Load Products by Category
// ============================================

function loadProductsByCategory(category, carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const filteredProducts = allProducts
        .filter(p => p.category === category)
        .slice(0, 10);

    if (filteredProducts.length === 0) {
        carousel.innerHTML = '<p style="padding: var(--space-8); text-align: center; color: var(--text-secondary);">No products in this category.</p>';
        return;
    }

    carousel.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// ============================================
// Carousel Controls
// ============================================

function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const scrollAmount = 320; // Card width + gap
    const currentScroll = carousel.scrollLeft;

    if (direction === 'left') {
        carousel.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        carousel.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Search Functionality
// ============================================

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query) {
        // Save to search history
        saveSearchHistory(query);

        // Redirect to shop page with search query
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

function saveSearchHistory(query) {
    let history = Storage.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY) || [];

    // Remove duplicates and add to beginning
    history = history.filter(item => item !== query);
    history.unshift(query);

    // Keep only last 10 searches
    history = history.slice(0, 10);

    Storage.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, history);
}

// ============================================
// Quick Actions
// ============================================

function quickAddToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        Cart.add(product);
    }
}

function quickAddToWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        Wishlist.toggle(product);
    }
}

// ============================================
// Auto-login for Demo
// ============================================

function autoLoginDemo() {
    // Check if already logged in
    if (Auth.isLoggedIn()) {
        return;
    }

    // Auto-login as demo student for quick demo
    const demoUser = {
        id: 'user_002',
        email: 'student@college.edu',
        name: 'Aarja',
        role: 'student',
        vcBalance: 5000,
        joinDate: '2024-09-01',
        college: 'IIT Bombay',
        phone: '+91 98765 43211'
    };

    Storage.set(CONFIG.STORAGE_KEYS.USER, demoUser);
    updateUIForUser();

    // Show welcome message
    setTimeout(() => {
        showToast('info', 'Demo Mode', 'Logged in as demo student. You can explore all features!');
    }, 1000);
}

// ============================================
// Smooth Scroll
// ============================================

function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }
});

// ============================================
// Intersection Observer for Animations
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all carousel sections
    const sections = document.querySelectorAll('.carousel-section, .promo-section');
    sections.forEach(section => observer.observe(section));
}

// ============================================
// Performance Optimization
// ============================================

// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        return;
    }

    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show toast for every error, just log it
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Don't show toast for every error, just log it
});

// ============================================
// Page Visibility
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
        // Refresh cart and wishlist counts
        updateCartCount();
        updateWishlistCount();
        updateVCBalance();
    }
});

// ============================================
// Initialize Everything
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('E-cell Store - Student Marketplace v' + CONFIG.VERSION);

    // Auto-login for demo (comment this out in production)
    autoLoginDemo();

    // Initialize homepage
    await initHomepage();

    // Initialize animations
    initScrollAnimations();

    // Initialize lazy loading
    initLazyLoading();

    // Log ready state
    console.log('Homepage initialized successfully');
    console.log(`Loaded ${allProducts.length} products`);
});

// ============================================
// Service Worker Registration (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //   .then(registration => console.log('SW registered:', registration))
        //   .catch(error => console.log('SW registration failed:', error));
    });
}
