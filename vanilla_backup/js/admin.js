// Admin Panel Logic

const { db } = window.firebaseApp;
const { showAlert, getCurrentUser, formatVC, formatDate } = window.utils;

async function initAdminPanel() {
    setupTabs();
    await loadProducts();
    await loadUsers();
    await loadAnnouncements();
    setupForms();
    setupEventListeners();
}

function setupTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tabName + 'Section').classList.add('active');
        });
    });
}

// ========== PRODUCTS ==========

async function loadProducts() {
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        const tbody = document.getElementById('productsTable');

        tbody.innerHTML = snapshot.docs.map(doc => {
            const product = doc.data();
            return `
                <tr>
                    <td><img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: contain;"></td>
                    <td>${product.title}</td>
                    <td>${product.category}</td>
                    <td>${formatVC(product.cost)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="deleteProduct('${doc.id}')">
                            <i data-lucide="trash-2"></i>
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        lucide.createIcons();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function addProduct(productData) {
    try {
        await db.collection('products').add({
            ...productData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showAlert('Product added successfully!', 'success');
        await loadProducts();
        document.getElementById('productForm').reset();
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('Error adding product', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await db.collection('products').doc(productId).delete();
        showAlert('Product deleted successfully!', 'success');
        await loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error deleting product', 'error');
    }
}

// ========== USERS ==========

async function loadUsers() {
    try {
        const snapshot = await db.collection('users').get();
        const tbody = document.getElementById('usersTable');

        tbody.innerHTML = snapshot.docs.map(doc => {
            const user = doc.data();
            return `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${formatVC(user.balance)}</td>
                    <td>${user.isAdmin ? '✓' : '✗'}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="updateUserBalance('${doc.id}')">
                            <i data-lucide="coins"></i>
                            Update Balance
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        lucide.createIcons();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function updateUserBalance(userId) {
    const newBalance = prompt('Enter new balance:');
    if (!newBalance || isNaN(newBalance)) return;

    try {
        await db.collection('users').doc(userId).update({
            balance: parseInt(newBalance)
        });

        showAlert('Balance updated successfully!', 'success');
        await loadUsers();
    } catch (error) {
        console.error('Error updating balance:', error);
        showAlert('Error updating balance', 'error');
    }
}

// ========== ANNOUNCEMENTS ==========

async function loadAnnouncements() {
    try {
        const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
        const tbody = document.getElementById('announcementsTable');

        tbody.innerHTML = snapshot.docs.map(doc => {
            const announcement = doc.data();
            return `
                <tr>
                    <td>${announcement.title}</td>
                    <td>${announcement.author}</td>
                    <td>${formatDate(announcement.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="deleteAnnouncement('${doc.id}')">
                            <i data-lucide="trash-2"></i>
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        lucide.createIcons();
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

async function addAnnouncement(announcementData) {
    const user = getCurrentUser();

    try {
        await db.collection('announcements').add({
            ...announcementData,
            author: user.name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showAlert('Announcement posted successfully!', 'success');
        await loadAnnouncements();
        document.getElementById('announcementForm').reset();
    } catch (error) {
        console.error('Error posting announcement:', error);
        showAlert('Error posting announcement', 'error');
    }
}

async function deleteAnnouncement(announcementId) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
        await db.collection('announcements').doc(announcementId).delete();
        showAlert('Announcement deleted successfully!', 'success');
        await loadAnnouncements();
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showAlert('Error deleting announcement', 'error');
    }
}

// ========== FORMS ==========

function setupForms() {
    // Product form
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const productData = {
            title: document.getElementById('productTitle').value,
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value,
            cost: parseInt(document.getElementById('productCost').value),
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value
        };

        addProduct(productData);
    });

    // Announcement form
    document.getElementById('announcementForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const announcementData = {
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value
        };

        addAnnouncement(announcementData);
    });
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => window.authFunctions.logout());
}

// Export functions for inline onclick handlers
window.deleteProduct = deleteProduct;
window.updateUserBalance = updateUserBalance;
window.deleteAnnouncement = deleteAnnouncement;
window.initAdminPanel = initAdminPanel;
