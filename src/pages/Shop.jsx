import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'

const Shop = () => {
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
    const [minRating, setMinRating] = useState(0)
    const [sortBy, setSortBy] = useState('featured')
    const [currentView, setCurrentView] = useState('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const categories = [
        'Tech Essentials',
        'Premium Apparel',
        'The Launchpad',
        'Office Supplies',
        'Books & Learning',
        'Home Hacks',
        'Bottles & Sippers',
        'Storage & Organizers',
        'Personalised Products'
    ]
    const priceRanges = [
        { label: 'Under 300🪙', min: 0, max: 300 },
        { label: '301🪙 - 1000🪙', min: 301, max: 1000 },
        { label: '1001🪙 - 5000🪙', min: 1001, max: 5000 },
        { label: 'Above 5000🪙', min: 5001, max: Infinity },
    ]

    useEffect(() => {
        fetchProducts()
    }, [])

    // Sync URL params to state
    useEffect(() => {
        const category = searchParams.get('category')
        if (category) {
            setSelectedCategories(prev => {
                if (prev.includes(category)) return prev
                return [category]
            })
        }
    }, [searchParams])

    // Apply filters when state changes settings
    useEffect(() => {
        const search = searchParams.get('search')
        applyFilters(search)
    }, [products, selectedCategories, selectedPriceRanges, minRating, sortBy, searchParams])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/data/products.json')
            const data = await response.json()
            setProducts(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const applyFilters = (searchQuery = null) => {
        let filtered = [...products]

        // Search filter
        const search = searchQuery || searchParams.get('search')
        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category))
        }

        // Price range filter
        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(p =>
                selectedPriceRanges.some(range => p.price >= range.min && p.price <= range.max)
            )
        }

        // Rating filter
        if (minRating > 0) {
            filtered = filtered.filter(p => p.rating >= minRating)
        }

        // Sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating)
                break
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            default:
                break
        }

        setFilteredProducts(filtered)
        setCurrentPage(1)
    }

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const togglePriceRange = (range) => {
        setSelectedPriceRanges(prev =>
            prev.some(r => r.label === range.label)
                ? prev.filter(r => r.label !== range.label)
                : [...prev, range]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setSelectedPriceRanges([])
        setMinRating(0)
        setSortBy('featured')
    }

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    if (loading) {
        return (
            <Layout>
                <main className="shop-main">
                    <div className="container">
                        <div className="loading-container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                            <div className="loading-spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
                            <p>Loading products...</p>
                        </div>
                    </div>
                </main>
            </Layout>
        )
    }

    return (
        <Layout>
            <main className="shop-main">
                <div className="container">
                    <div className="shop-header">
                        <div>
                            <h1 className="shop-title">Shop All Products</h1>
                            <p className="shop-subtitle" id="productCount">
                                Showing {filteredProducts.length} of {products.length} products
                            </p>
                        </div>

                        <div className="shop-view-toggle">
                            <button
                                className={`view-toggle-btn ${currentView === 'grid' ? 'active' : ''}`}
                                onClick={() => setCurrentView('grid')}
                            >
                                <i className="fas fa-th"></i>
                            </button>
                            <button
                                className={`view-toggle-btn ${currentView === 'list' ? 'active' : ''}`}
                                onClick={() => setCurrentView('list')}
                            >
                                <i className="fas fa-list"></i>
                            </button>
                        </div>
                    </div>

                    <div className="shop-container">
                        {/* Filters Sidebar */}
                        <aside className="shop-filters">
                            <div className="filter-section">
                                <h3 className="filter-title">Categories</h3>
                                <div className="filter-options" id="categoryFilters">
                                    {categories.map((category) => (
                                        <label key={category} className="filter-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                            />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-section">
                                <h3 className="filter-title">Price Range</h3>
                                <div className="filter-options" id="priceFilters">
                                    {priceRanges.map((range, index) => (
                                        <label key={index} className="filter-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedPriceRanges.some(r => r.label === range.label)}
                                                onChange={() => togglePriceRange(range)}
                                            />
                                            <span>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-section">
                                <h3 className="filter-title">Rating</h3>
                                <div className="filter-options">
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={minRating === 4}
                                            onChange={() => setMinRating(minRating === 4 ? 0 : 4)}
                                        />
                                        <span>4★ & above</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={minRating === 3}
                                            onChange={() => setMinRating(minRating === 3 ? 0 : 3)}
                                        />
                                        <span>3★ & above</span>
                                    </label>
                                </div>
                            </div>

                            <button className="btn btn-outline" style={{ width: '100%' }} onClick={clearFilters}>
                                <i className="fas fa-redo"></i>
                                Clear Filters
                            </button>
                        </aside>

                        {/* Products Grid */}
                        <div className="shop-content">
                            <div className="shop-toolbar">
                                <div className="shop-results" id="resultsCount">
                                    Showing {getPaginatedProducts().length} of {filteredProducts.length} products
                                </div>

                                <div className="shop-sort">
                                    <label htmlFor="sortSelect">Sort by:</label>
                                    <select
                                        id="sortSelect"
                                        className="select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{ width: 'auto' }}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="name">Name: A-Z</option>
                                    </select>
                                </div>
                            </div>

                            <div className={`products-grid ${currentView}`} id="productsGrid" style={currentView === 'list' ? { gridTemplateColumns: '1fr' } : {}}>
                                {getPaginatedProducts().length > 0 ? (
                                    getPaginatedProducts().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            variant={currentView === 'list' ? 'horizontal' : 'vertical'}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-16)' }}>
                                        <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>🔍</div>
                                        <h3>No products found</h3>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                            Try adjusting your filters or search query
                                        </p>
                                        <button className="btn btn-primary" onClick={clearFilters}>
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination" id="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="pagination-ellipsis">...</span>
                                        }
                                        return null
                                    })}

                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default Shop
