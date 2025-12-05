// Cart Page Logic

const { db } = window.firebaseApp;
const { showLoading, hideLoading, showAlert, getCurrentUser, formatVC } = window.utils;

let cartItems = [];
let products = [];

async function initCartPage() {
    const user = getCurrentUser();
    document.getElementById('userBalance').textContent = formatVC(user.balance);
    document.getElementById('balanceDisplay').textContent = formatVC(user.balance);

    await loadCart();
    setupEventListeners();
}

async function loadCart() {
    const cartData = localStorage.getItem('cart');
    const productIds = cartData ? JSON.parse(cartData) : [];

    if (productIds.length === 0) {
        showEmptyCart();
        return;
    }

    // Load product details
    try {
        const snapshot = await db.collection('products').get();
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group cart items by product ID and count quantities
        const itemCounts = {};
        productIds.forEach(id => {
            itemCounts[id] = (itemCounts[id] || 0) + 1;
        });

        cartItems = Object.entries(itemCounts).map(([id, quantity]) => {
            const product = products.find(p => p.id === id);
            return product ? { ...product, quantity } : null;
        }).filter(item => item !== null);

        renderCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        showAlert('Error loading cart', 'error');
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const summary = document.getElementById('cartSummary');

    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }

    emptyCart.classList.add('hidden');
    summary.classList.remove('hidden');

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p class="text-secondary">${item.description}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">
                            <i data-lucide="minus"></i>
                        </button>
                        <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="removeFromCart('${item.id}')">
                        <i data-lucide="trash-2"></i>
                        Remove
                    </button>
                </div>
            </div>
            <div>
                <p class="text-primary" style="font-size: 1.25rem; font-weight: 700;">${formatVC(item.cost * item.quantity)}</p>
                <p class="text-secondary" style="font-size: 0.875rem;">${formatVC(item.cost)} each</p>
            </div>
        </div>
    `).join('');

    updateSummary();
    lucide.createIcons();
}

function updateSummary() {
    const total = cartItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('subtotal').textContent = formatVC(total);
    document.getElementById('total').textContent = formatVC(total);
    document.getElementById('itemCount').textContent = itemCount;
}

function updateQuantity(productId, change) {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    // Update localStorage
    const cart = [];
    cartItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            cart.push(item.id);
        }
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    renderCart();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);

    // Update localStorage
    const cart = [];
    cartItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            cart.push(item.id);
        }
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    showAlert('Item removed from cart', 'success');
    renderCart();
}

function showEmptyCart() {
    document.getElementById('cartItems').innerHTML = '';
    document.getElementById('emptyCart').classList.remove('hidden');
    document.getElementById('cartSummary').classList.add('hidden');
}

async function checkout() {
    const user = getCurrentUser();
    const total = cartItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    if (user.balance < total) {
        showAlert('Insufficient balance!', 'error');
        return;
    }

    try {
        // Create order
        const order = {
            userId: user.uid,
            items: cartItems.map(item => ({
                productId: item.id,
                title: item.title,
                quantity: item.quantity,
                cost: item.cost
            })),
            totalCost: total,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('orders').add(order);

        // Update user balance
        const newBalance = user.balance - total;
        await window.authFunctions.updateBalance(user.uid, newBalance);

        // Clear cart
        localStorage.removeItem('cart');

        showAlert('Order placed successfully!', 'success');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    } catch (error) {
        console.error('Checkout error:', error);
        showAlert('Checkout failed. Please try again.', 'error');
    }
}

function setupEventListeners() {
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('logoutBtn').addEventListener('click', () => window.authFunctions.logout());
}

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.initCartPage = initCartPage;
