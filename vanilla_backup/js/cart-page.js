// ============================================
// CART PAGE - e-store
// ============================================

async function initCartPage() {
    renderCart();
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    const cart = Cart.get();

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">
                    Add some products to get started!
                </p>
                <button class="btn btn-primary btn-lg" onclick="window.location.href='shop.html'">
                    <i class="fas fa-shopping-bag"></i>
                    Continue Shopping
                </button>
            </div>
        `;
        return;
    }

    const subtotal = Cart.getTotal();
    const shipping = subtotal >= CONFIG.DEFAULTS.FREE_SHIPPING_THRESHOLD ? 0 : 50;
    const total = subtotal + shipping;
    const vcEarned = Math.floor(total * CONFIG.DEFAULTS.VC_EARN_RATE);

    cartContent.innerHTML = `
        <div class="cart-container">
            <div class="cart-items">
                ${cart.map(item => createCartItem(item)).join('')}
            </div>
            
            <div class="cart-summary">
                <h2 class="summary-title">Order Summary</h2>
                
                <div class="summary-row">
                    <span class="summary-label">Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span class="summary-value">${formatPrice(subtotal)}</span>
                </div>
                
                <div class="summary-row">
                    <span class="summary-label">Shipping</span>
                    <span class="summary-value">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                
                ${shipping > 0 ? `
                    <div style="padding: var(--space-3); background-color: var(--info-light); border-radius: var(--radius-md); margin: var(--space-3) 0;">
                        <small style="color: var(--info);">
                            <i class="fas fa-info-circle"></i>
                            Add ${formatPrice(CONFIG.DEFAULTS.FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE shipping!
                        </small>
                    </div>
                ` : `
                    <div style="padding: var(--space-3); background-color: var(--success-light); border-radius: var(--radius-md); margin: var(--space-3) 0;">
                        <small style="color: var(--success);">
                            <i class="fas fa-check-circle"></i>
                            You qualify for FREE shipping!
                        </small>
                    </div>
                `}
                
                <div class="summary-row">
                    <span class="summary-label">VC Points Earned</span>
                    <span class="summary-value" style="color: var(--accent-gold);">+${vcEarned} VC</span>
                </div>
                
                <div class="summary-row">
                    <span class="summary-label" style="font-size: var(--text-lg); color: var(--text-primary);">Total</span>
                    <span class="summary-total">${formatPrice(total)}</span>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-4);" onclick="proceedToCheckout()">
                    <i class="fas fa-lock"></i>
                    Proceed to Checkout
                </button>
                
                <button class="btn btn-outline" style="width: 100%; margin-top: var(--space-3);" onclick="window.location.href='shop.html'">
                    <i class="fas fa-arrow-left"></i>
                    Continue Shopping
                </button>
                
                <div style="text-align: center; margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--border-color);">
                    <button class="btn btn-ghost" onclick="clearCart()" style="color: var(--error);">
                        <i class="fas fa-trash"></i>
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createCartItem(item) {
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/120x120?text=${encodeURIComponent(item.name)}'">
            </div>
            
            <div class="cart-item-details">
                <div>
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                </div>
                
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                               onchange="updateQuantity('${item.id}', parseInt(this.value))" readonly>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <span style="color: var(--text-secondary); font-size: var(--text-sm);">
                        Subtotal: <strong style="color: var(--text-primary);">${formatPrice(item.price * item.quantity)}</strong>
                    </span>
                </div>
            </div>
            
            <div class="cart-item-remove">
                <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remove from cart">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > 99) {
        showToast('warning', 'Maximum Quantity', 'You can only add up to 99 items.');
        return;
    }

    Cart.update(productId, newQuantity);
    renderCart();
}

function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        Cart.remove(productId);
        renderCart();
        showToast('info', 'Item Removed', 'Product removed from cart.');
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        Cart.clear();
        renderCart();
        showToast('info', 'Cart Cleared', 'All items removed from cart.');
    }
}

function proceedToCheckout() {
    const user = Auth.getCurrentUser();

    if (!user) {
        showToast('warning', 'Login Required', 'Please login to proceed to checkout.');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=cart.html';
        }, 1500);
        return;
    }

    const cart = Cart.get();
    const total = Cart.getTotal();
    const vcEarned = Math.floor(total * CONFIG.DEFAULTS.VC_EARN_RATE);

    // Simulate order placement
    const order = {
        id: `order_${Date.now()}`,
        userId: user.id,
        items: cart,
        total: total,
        status: 'processing',
        orderDate: new Date().toISOString(),
        vcEarned: vcEarned
    };

    // Add VC points to user
    Auth.addVCPoints(vcEarned);

    // Clear cart
    Cart.clear();

    // Show success message
    showToast('success', 'Order Placed!', `Your order has been placed successfully. You earned ${vcEarned} VC points!`);

    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
});
