// ============================================
// UTILITY FUNCTIONS - e-store
// ============================================

// ============================================
// Local Storage Helpers
// ============================================

const Storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ============================================
// Cart Management
// ============================================

const Cart = {
    get() {
        return Storage.get(CONFIG.STORAGE_KEYS.CART) || [];
    },

    add(product, quantity = 1) {
        const cart = this.get();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        Storage.set(CONFIG.STORAGE_KEYS.CART, cart);
        updateCartCount();
        showToast('success', 'Added to Cart', `${product.name} has been added to your cart.`);
        return cart;
    },

    remove(productId) {
        const cart = this.get();
        const filtered = cart.filter(item => item.id !== productId);
        Storage.set(CONFIG.STORAGE_KEYS.CART, filtered);
        updateCartCount();
        return filtered;
    },

    update(productId, quantity) {
        const cart = this.get();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.remove(productId);
            }
            item.quantity = quantity;
            Storage.set(CONFIG.STORAGE_KEYS.CART, cart);
            updateCartCount();
        }

        return cart;
    },

    clear() {
        Storage.set(CONFIG.STORAGE_KEYS.CART, []);
        updateCartCount();
    },

    getTotal() {
        const cart = this.get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getCount() {
        const cart = this.get();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }
};

// ============================================
// Wishlist Management
// ============================================

const Wishlist = {
    get() {
        return Storage.get(CONFIG.STORAGE_KEYS.WISHLIST) || [];
    },

    add(product) {
        const wishlist = this.get();

        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });

            Storage.set(CONFIG.STORAGE_KEYS.WISHLIST, wishlist);
            updateWishlistCount();
            showToast('success', 'Added to Wishlist', `${product.name} has been added to your wishlist.`);
        }

        return wishlist;
    },

    remove(productId) {
        const wishlist = this.get();
        const filtered = wishlist.filter(item => item.id !== productId);
        Storage.set(CONFIG.STORAGE_KEYS.WISHLIST, filtered);
        updateWishlistCount();
        return filtered;
    },

    toggle(product) {
        const wishlist = this.get();
        const exists = wishlist.find(item => item.id === product.id);

        if (exists) {
            return this.remove(product.id);
        } else {
            return this.add(product);
        }
    },

    has(productId) {
        const wishlist = this.get();
        return wishlist.some(item => item.id === productId);
    },

    clear() {
        Storage.set(CONFIG.STORAGE_KEYS.WISHLIST, []);
        updateWishlistCount();
    },

    getCount() {
        return this.get().length;
    }
};

// ============================================
// Toast Notifications
// ============================================

function showToast(type = 'info', title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };

    toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon" style="color: ${colors[type]}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
}

// ============================================
// Format Helpers
// ============================================

function formatPrice(price) {
    return `${price.toLocaleString('en-IN')}${CONFIG.DEFAULTS.CURRENCY}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// ============================================
// Product Card Generator
// ============================================

function createProductCard(product) {
    const discount = calculateDiscount(product.originalPrice, product.price);
    const inWishlist = Wishlist.has(product.id);

    return `
    <div class="product-card carousel-item" data-product-id="${product.id}">
      <div class="product-card-image" onclick="viewProduct('${product.id}')">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}'">
        ${discount > 0 ? `<span class="product-card-badge">${discount}% OFF</span>` : ''}
        ${product.stock < 10 ? `<span class="product-card-badge" style="left: auto; right: var(--space-3); background-color: var(--error);">Only ${product.stock} left</span>` : ''}
      </div>
      
      <div class="product-card-actions">
        <button class="product-card-action-btn" onclick="Wishlist.toggle(${JSON.stringify(product).replace(/"/g, '&quot;')}); this.querySelector('i').classList.toggle('fas'); this.querySelector('i').classList.toggle('far');" title="Add to Wishlist">
          <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <button class="product-card-action-btn" onclick="viewProduct('${product.id}')" title="Quick View">
          <i class="fas fa-eye"></i>
        </button>
      </div>
      
      <div class="product-card-content">
        <div class="product-card-category">${product.category}</div>
        <h3 class="product-card-title">${product.name}</h3>
        
        <div class="product-card-rating">
          <div class="product-card-stars">
            ${generateStars(product.rating)}
          </div>
          <span class="product-card-reviews">(${product.reviews})</span>
        </div>
        
        <div class="product-card-price">
          <span class="product-card-price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="product-card-price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="product-card-discount">${discount}% OFF</span>` : ''}
        </div>
        
        <div class="product-card-footer">
          <button class="btn btn-primary" style="flex: 1;" onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <i class="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// ============================================
// Data Fetching
// ============================================

async function fetchProducts() {
    try {
        const response = await fetch(CONFIG.API.PRODUCTS);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast('error', 'Error', 'Failed to load products. Please refresh the page.');
        return [];
    }
}

async function fetchUsers() {
    try {
        const response = await fetch(CONFIG.API.USERS);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(CONFIG.API.ORDERS);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function fetchAnnouncements() {
    try {
        const response = await fetch(CONFIG.API.ANNOUNCEMENTS);
        if (!response.ok) throw new Error('Failed to fetch announcements');
        return await response.json();
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
    }
}

// ============================================
// UI Updates
// ============================================

function updateCartCount() {
    const count = Cart.getCount();
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function updateWishlistCount() {
    const count = Wishlist.getCount();
    const badge = document.getElementById('wishlistCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function updateVCBalance() {
    const user = Storage.get(CONFIG.STORAGE_KEYS.USER);
    const vcAmount = document.getElementById('vcAmount');

    if (vcAmount) {
        if (user && user.vcBalance !== undefined) {
            vcAmount.textContent = `${user.vcBalance.toLocaleString('en-IN')} VC`;
        } else {
            vcAmount.textContent = '0 VC';
        }
    }
}

// ============================================
// Theme Toggle
// ============================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    Storage.set(CONFIG.STORAGE_KEYS.THEME, newTheme);

    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');

    if (icon) {
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (label) {
        label.textContent = newTheme === 'light' ? 'Dark' : 'Light';
    }
}

function initTheme() {
    const savedTheme = Storage.get(CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');

    if (icon) {
        icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (label) {
        label.textContent = savedTheme === 'light' ? 'Dark' : 'Light';
    }
}

// ============================================
// Navigation
// ============================================

function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function filterByCategory(category) {
    window.location.href = `shop.html?category=${encodeURIComponent(category)}`;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// ============================================
// Search
// ============================================

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
    }
}

// Add enter key support for search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// ============================================
// Initialize on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartCount();
    updateWishlistCount();
    updateVCBalance();
});
