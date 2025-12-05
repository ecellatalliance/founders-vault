// Wishlist Page Logic

const { db } = window.firebaseApp;
const { showAlert, formatVC } = window.utils;

let wishlistItems = [];

async function initWishlistPage() {
    await loadWishlist();
    setupEventListeners();
}

async function loadWishlist() {
    const wishlistData = localStorage.getItem('wishlist');
    const productIds = wishlistData ? JSON.parse(wishlistData) : [];

    if (productIds.length === 0) {
        showEmptyWishlist();
        return;
    }

    try {
        const snapshot = await db.collection('products').get();
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        wishlistItems = allProducts.filter(p => productIds.includes(p.id));
        renderWishlist();
    } catch (error) {
        console.error('Error loading wishlist:', error);
        showAlert('Error loading wishlist', 'error');
    }
}

function renderWishlist() {
    const container = document.getElementById('wishlistGrid');
    const emptyMessage = document.getElementById('emptyWishlist');

    if (wishlistItems.length === 0) {
        showEmptyWishlist();
        return;
    }

    emptyMessage.classList.add('hidden');
    container.innerHTML = wishlistItems.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                <button class="wishlist-btn active" onclick="removeFromWishlist('${product.id}')">
                    <i data-lucide="heart" fill="currentColor"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatVC(product.cost)}</span>
                    <button class="btn btn-sm btn-primary" onclick="addToCart('${product.id}')">
                        <i data-lucide="shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function removeFromWishlist(productId) {
    const wishlistData = localStorage.getItem('wishlist');
    let wishlist = wishlistData ? JSON.parse(wishlistData) : [];

    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    showAlert('Removed from wishlist', 'success');
    renderWishlist();
}

function addToCart(productId) {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];

    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    showAlert('Added to cart!', 'success');
}

function showEmptyWishlist() {
    document.getElementById('wishlistGrid').innerHTML = '';
    document.getElementById('emptyWishlist').classList.remove('hidden');
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => window.authFunctions.logout());
}

window.removeFromWishlist = removeFromWishlist;
window.addToCart = addToCart;
window.initWishlistPage = initWishlistPage;
