import { useAuth } from '../context/AuthContext'

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, isInWishlist, toggleWishlist } = useCart()
    const { isAuthenticated } = useAuth()
    const { products, loading: productsLoading } = useProducts()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        if (!productsLoading) {
            const foundProduct = products.find(p => p.id == id)
            if (foundProduct) {
                setProduct(foundProduct)
            } else if (products.length > 0) {
                console.error('Product not found')
            }
            setLoading(false)
        }
    }, [id, products, productsLoading])

    if (loading) {
        return (
            <Layout>
                <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                    <div className="loading-spinner"></div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout>
                <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                    <h1>Product not found</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                        Back to Shop
                    </button>
                </div>
            </Layout>
        )
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const handleBuyNow = () => {
        addToCart(product)
        navigate('/checkout')
    }

    return (
        <Layout>
            <main className="product-details-main" style={{ padding: 'var(--space-8) 0' }}>
                <div className="container">
                    {/* Breadcrumbs */}
                    <div style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Shop</span>
                        {' > '}
                        <span>{product.category}</span>
                        {' > '}
                        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                    </div>

                    <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
                        {/* Images Section */}
                        <div className="product-gallery">
                            <div className="main-image-wrapper" style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                border: '1px solid var(--border-color)',
                                aspectRatio: '1/1',
                                marginBottom: 'var(--space-4)'
                            }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            {/* Thumbnails */}
                            <div className="thumbnails" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {[product.image].map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            border: selectedImage === i ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedImage(i)}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="product-info">
                            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>{product.name}</h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', gap: 'var(--space-1)' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`} style={{ color: i < Math.floor(product.rating) ? '#fbbf24' : '#e5e7eb' }}></i>
                                    ))}
                                    <span style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-2)', fontSize: '0.9rem' }}>({product.reviews} reviews)</span>
                                </div>
                                <span style={{ color: 'var(--text-secondary)' }}>•</span>
                                <span style={{ color: product.stock > 0 ? '#059669' : '#dc2626', fontWeight: 500 }}>
                                    {product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock') : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Price Block - Protected */}
                            {isAuthenticated ? (
                                <div className="price-block" style={{ marginBottom: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                            {product.price.toLocaleString('en-IN')}🪙
                                        </span>
                                        {product.originalPrice && (
                                            <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                                                {product.originalPrice.toLocaleString('en-IN')}🪙
                                            </span>
                                        )}
                                        {discount > 0 && (
                                            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="price-auth-block" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ marginBottom: 'var(--space-3)' }}>Login to view pricing and purchase this item.</p>
                                    <button className="btn btn-outline" onClick={() => navigate('/login')}>Login Now</button>
                                </div>
                            )}

                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                                {product.description}
                            </p>

                            {/* Features List */}
                            {product.features && (
                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>Key Features</h3>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {product.features.map((feature, index) => (
                                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                                                <i className="fas fa-check" style={{ color: '#059669', fontSize: '0.8rem' }}></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions - Protected */}
                            {isAuthenticated && (
                                <div className="product-actions" style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: 'var(--space-3)', fontSize: '1.1rem' }}
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        <i className="fas fa-shopping-cart" style={{ marginRight: 'var(--space-2)' }}></i>
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>

                                    <button
                                        className="btn"
                                        style={{ flex: 1, padding: 'var(--space-3)', fontSize: '1.1rem', background: '#059669', color: 'white', border: 'none' }}
                                        onClick={handleBuyNow}
                                        disabled={product.stock === 0}
                                    >
                                        <i className="fas fa-bolt" style={{ marginRight: 'var(--space-2)' }}></i>
                                        Buy Now
                                    </button>

                                    <button
                                        className="btn btn-outline"
                                        style={{ padding: '0 var(--space-4)', fontSize: '1.2rem' }}
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`} style={{ color: isInWishlist(product.id) ? '#ef4444' : 'inherit' }}></i>
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

export default ProductDetails
