// ============================================
// SHOP PAGE - E-cell Store
// ============================================

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 12;
let currentView = 'grid';

// Filters state
let filters = {
    categories: [],
    priceRanges: [],
    minRating: 0,
    search: ''
};

let currentSort = 'featured';

// ============================================
// Initialize Shop Page
// ============================================

async function initShop() {
    try {
        // Fetch all products
        allProducts = await fetchProducts();

        if (allProducts.length === 0) {
            showEmptyState('No products available', 'Check back later for new products!');
            return;
        }

        // Parse URL parameters
        parseURLParams();

        // Initialize filters UI
        initializeFilters();

        // Apply filters and display products
        applyFilters();

    } catch (error) {
        console.error('Error initializing shop:', error);
        showToast('error', 'Error', 'Failed to load products. Please refresh the page.');
    }
}

// ============================================
// Parse URL Parameters
// ============================================

function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Category filter
    const category = urlParams.get('category');
    if (category) {
        filters.categories = [category];
    }

    // Price filters
    const minPrice = urlParams.get('minPrice');
    const maxPrice = urlParams.get('maxPrice');
    if (minPrice || maxPrice) {
        filters.priceRanges = [{
            min: minPrice ? parseInt(minPrice) : 0,
            max: maxPrice ? parseInt(maxPrice) : Infinity
        }];
    }

    // Search query
    const search = urlParams.get('search');
    if (search) {
        filters.search = search;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = search;
        }
    }
}

// ============================================
// Initialize Filters UI
// ============================================

function initializeFilters() {
    // Category filters
    const categoryFilters = document.getElementById('categoryFilters');
    if (categoryFilters) {
        const categories = [...new Set(allProducts.map(p => p.category))];
        const categoryCounts = {};

        categories.forEach(cat => {
            categoryCounts[cat] = allProducts.filter(p => p.category === cat).length;
        });

        categoryFilters.innerHTML = categories.map(category => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${category}" 
               ${filters.categories.includes(category) ? 'checked' : ''}
               onchange="toggleCategoryFilter('${category}')">
        <span>${category}</span>
        <span class="filter-badge">${categoryCounts[category]}</span>
      </label>
    `).join('');
    }

    // Price range filters
    const priceFilters = document.getElementById('priceFilters');
    if (priceFilters) {
        const priceRanges = CONFIG.PRICE_RANGES;

        priceFilters.innerHTML = priceRanges.map((range, index) => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${index}" onchange="togglePriceFilter(${index})">
        <span>${range.label}</span>
      </label>
    `).join('');
    }
}

// ============================================
// Filter Functions
// ============================================

function toggleCategoryFilter(category) {
    const index = filters.categories.indexOf(category);
    if (index > -1) {
        filters.categories.splice(index, 1);
    } else {
        filters.categories.push(category);
    }
    applyFilters();
}

function togglePriceFilter(rangeIndex) {
    const range = CONFIG.PRICE_RANGES[rangeIndex];
    const existingIndex = filters.priceRanges.findIndex(
        r => r.min === range.min && r.max === range.max
    );

    if (existingIndex > -1) {
        filters.priceRanges.splice(existingIndex, 1);
    } else {
        filters.priceRanges.push(range);
    }
    applyFilters();
}

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
        }

        // Price range filter
        if (filters.priceRanges.length > 0) {
            const inRange = filters.priceRanges.some(range =>
                product.price >= range.min && product.price <= range.max
            );
            if (!inRange) return false;
        }

        // Rating filter
        const ratingCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"][value]');
        const checkedRatings = Array.from(ratingCheckboxes)
            .filter(cb => cb.checked && !isNaN(cb.value))
            .map(cb => parseFloat(cb.value));

        if (checkedRatings.length > 0) {
            const minRating = Math.min(...checkedRatings);
            if (product.rating < minRating) return false;
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
        }

        return true;
    });

    // Apply sorting
    applySortToFiltered();

    // Reset to first page
    currentPage = 1;

    // Display products
    displayProducts();
    updateResultsCount();
}

function clearFilters() {
    filters = {
        categories: [],
        priceRanges: [],
        minRating: 0,
        search: ''
    };

    // Clear all checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);

    applyFilters();
}

// ============================================
// Sorting
// ============================================

function applySort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        currentSort = sortSelect.value;
        applySortToFiltered();
        displayProducts();
    }
}

function applySortToFiltered() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

// ============================================
// Display Products
// ============================================

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (filteredProducts.length === 0) {
        showEmptyState(
            'No products found',
            'Try adjusting your filters or search query'
        );
        return;
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Set grid class based on view
    grid.className = `products-grid ${currentView === 'list' ? 'list-view' : ''}`;

    // Render products
    grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');

    // Update pagination
    updatePagination();
}

function showEmptyState(title, message) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📦</div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-message">${message}</p>
      <button class="btn btn-primary" onclick="clearFilters()">
        <i class="fas fa-redo"></i>
        Clear All Filters
      </button>
    </div>
  `;

    // Hide pagination
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.innerHTML = '';
    }
}

// ============================================
// Pagination
// ============================================

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
    <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fas fa-chevron-left"></i>
    </button>
  `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
        ${i}
      </button>
    `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    paginationHTML += `
    <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fas fa-chevron-right"></i>
    </button>
  `;

    pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayProducts();

    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// View Toggle
// ============================================

function changeView(view) {
    currentView = view;

    // Update button states
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });

    // Re-display products with new view
    displayProducts();
}

// ============================================
// Results Count
// ============================================

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const productCount = document.getElementById('productCount');

    const total = filteredProducts.length;
    const showing = Math.min(itemsPerPage, total - (currentPage - 1) * itemsPerPage);

    if (resultsCount) {
        resultsCount.textContent = `Showing ${showing} of ${total} products`;
    }

    if (productCount) {
        productCount.textContent = `${total} products found`;
    }
}

// ============================================
// Search
// ============================================

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    filters.search = searchInput.value.trim();
    applyFilters();
}

// ============================================
// Initialize on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Shop page initializing...');

    // Initialize shop
    await initShop();

    console.log('Shop page initialized');
    console.log(`Total products: ${allProducts.length}`);
    console.log(`Filtered products: ${filteredProducts.length}`);
});
