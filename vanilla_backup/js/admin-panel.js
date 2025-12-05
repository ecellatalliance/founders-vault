// ============================================
// ADMIN PANEL - e-store
// ============================================

let allProducts = [];
let allUsers = [];
let allOrders = [];
let allAnnouncements = [];

// ============================================
// Initialize Admin Panel
// ============================================

async function initAdminPanel() {
    // Check admin access
    if (!Auth.isAdmin()) {
        requireAdmin();
        return;
    }

    // Update admin name
    const user = Auth.getCurrentUser();
    const adminName = document.getElementById('adminName');
    if (adminName) {
        adminName.textContent = user.name;
    }

    // Load all data
    await loadAllData();

    // Show dashboard
    showSection('dashboard');
}

async function loadAllData() {
    try {
        allProducts = await fetchProducts();
        allUsers = await fetchUsers();
        allOrders = await fetchOrders();
        allAnnouncements = await fetchAnnouncements();
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('error', 'Error', 'Failed to load data.');
    }
}

// ============================================
// Section Navigation
// ============================================

function showSection(sectionId) {
    // Update nav items
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Load section data
    switch (sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'announcements':
            loadAnnouncementsTable();
            break;
    }
}

// ============================================
// Dashboard
// ============================================

function loadDashboard() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    const totalProducts = allProducts.length;
    const totalUsers = allUsers.filter(u => u.role === 'student').length;
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Total Products</div>
            <div class="stat-value">${totalProducts}</div>
        </div>
        
        <div class="stat-card secondary">
            <div class="stat-label">Total Users</div>
            <div class="stat-value">${totalUsers}</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">${totalOrders}</div>
        </div>
        
        <div class="stat-card secondary">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">${formatPrice(totalRevenue)}</div>
        </div>
    `;
}

// ============================================
// Products Management
// ============================================

function loadProductsTable() {
    const container = document.getElementById('productsTable');
    if (!container) return;

    if (allProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No products found.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allProducts.map(product => `
                    <tr>
                        <td>
                            <img src="${product.image}" alt="${product.name}" 
                                 style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-md);"
                                 onerror="this.src='https://via.placeholder.com/50x50'">
                        </td>
                        <td><strong>${product.name}</strong></td>
                        <td><span class="badge badge-primary">${product.category}</span></td>
                        <td><strong>${formatPrice(product.price)}</strong></td>
                        <td>${product.stock}</td>
                        <td>⭐ ${product.rating}</td>
                        <td>
                            <button class="action-btn edit" onclick="editProduct('${product.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="action-btn delete" onclick="deleteProduct('${product.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddProductForm() {
    showToast('info', 'Add Product', 'This would open a form to add a new product. (Demo mode)');
}

function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        showToast('info', 'Edit Product', `Editing: ${product.name} (Demo mode)`);
    }
}

function deleteProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
        showToast('success', 'Product Deleted', `${product.name} has been deleted. (Demo mode)`);
    }
}

// ============================================
// Users Management
// ============================================

function loadUsersTable() {
    const container = document.getElementById('usersTable');
    if (!container) return;

    if (allUsers.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No users found.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>College</th>
                    <th>VC Balance</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allUsers.map(user => `
                    <tr>
                        <td><strong>${user.name}</strong></td>
                        <td>${user.email}</td>
                        <td>
                            <span class="badge ${user.role === 'admin' ? 'badge-error' : 'badge-success'}">
                                ${user.role}
                            </span>
                        </td>
                        <td>${user.college || 'N/A'}</td>
                        <td><strong style="color: var(--accent-gold);">${user.vcBalance.toLocaleString('en-IN')} VC</strong></td>
                        <td>${formatDate(user.joinDate)}</td>
                        <td>
                            <button class="action-btn edit" onclick="editUser('${user.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        showToast('info', 'Edit User', `Editing: ${user.name} (Demo mode)`);
    }
}

// ============================================
// Orders Management
// ============================================

function loadOrdersTable() {
    const container = document.getElementById('ordersTable');
    if (!container) return;

    if (allOrders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No orders found.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allOrders.map(order => {
        const user = allUsers.find(u => u.id === order.userId);
        const statusColors = {
            pending: 'badge-warning',
            processing: 'badge-primary',
            shipped: 'badge-primary',
            delivered: 'badge-success'
        };

        return `
                        <tr>
                            <td><strong>${order.id}</strong></td>
                            <td>${user ? user.name : 'Unknown'}</td>
                            <td>${order.items.length} items</td>
                            <td><strong>${formatPrice(order.total)}</strong></td>
                            <td>
                                <span class="badge ${statusColors[order.status] || 'badge-primary'}">
                                    ${order.status}
                                </span>
                            </td>
                            <td>${formatDate(order.orderDate)}</td>
                            <td>
                                <button class="action-btn edit" onclick="viewOrder('${order.id}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}

function viewOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        showToast('info', 'View Order', `Viewing order: ${order.id} (Demo mode)`);
    }
}

// ============================================
// Announcements Management
// ============================================

function loadAnnouncementsTable() {
    const container = document.getElementById('announcementsTable');
    if (!container) return;

    if (allAnnouncements.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No announcements found.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allAnnouncements.map(announcement => `
                    <tr>
                        <td><strong>${announcement.title}</strong></td>
                        <td><span class="badge badge-primary">${announcement.category}</span></td>
                        <td>${announcement.author}</td>
                        <td>${formatDate(announcement.date)}</td>
                        <td>
                            <button class="action-btn edit" onclick="editAnnouncement('${announcement.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="action-btn delete" onclick="deleteAnnouncement('${announcement.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddAnnouncementForm() {
    showToast('info', 'New Announcement', 'This would open a form to create a new announcement. (Demo mode)');
}

function editAnnouncement(announcementId) {
    const announcement = allAnnouncements.find(a => a.id === announcementId);
    if (announcement) {
        showToast('info', 'Edit Announcement', `Editing: ${announcement.title} (Demo mode)`);
    }
}

function deleteAnnouncement(announcementId) {
    const announcement = allAnnouncements.find(a => a.id === announcementId);
    if (announcement && confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
        showToast('success', 'Announcement Deleted', `${announcement.title} has been deleted. (Demo mode)`);
    }
}

// ============================================
// Initialize on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
});
