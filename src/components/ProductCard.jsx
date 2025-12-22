import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product, variant = 'vertical' }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useCart()
    const { isAuthenticated } = useAuth()

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    // Mock features if missing (for layout demo)
    const features = product.features || [
        'Hi-Res Audio with LDAC',
        'boAt Spatial Audio'
    ]
    // Removed colors logic as per request

    return (
        <div className={`product-card ${variant}`}>
            {/* Image Wrapper */}
            <div className="product-card-image-wrapper">
                <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
                        }}
                    />
                </Link>


                {/* Badges - Dynamic from DB */}
                {variant === 'vertical' && product.badge && (
                    <div className="card-badge badge-dynamic">
                        <i className="fas fa-certificate"></i> {product.badge}
                    </div>
                )}

                {/* Fallback for Bestseller if needed, or remove if fully dynamic */}
                {variant === 'vertical' && !product.badge && discount > 50 && (
                    <div className="card-badge badge-sale">
                        <i className="fas fa-bolt"></i> Mega Sale
                    </div>
                )}

                {/* Wishlist Button (Overlay) - Only for authenticated users */}
                {isAuthenticated && (
                    <button
                        className="product-card-action-btn"
                        style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 10, background: 'rgba(255,255,255,0.9)' }}
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
                )}

                {/* Highlight Bar */}
                <div className="highlight-bar">
                    {variant === 'vertical' && (
                        <div className="rating-pill">
                            <i className="fas fa-star" style={{ color: '#fbbf24' }}></i> {product.rating?.toFixed(1) || '4.5'}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Details */}
            <div className="product-card-details">
                {/* Horizontal: Rating at top */}
                {variant === 'horizontal' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
                        <span style={{ fontWeight: 600 }}>{product.rating?.toFixed(1) || '4.5'}</span>
                        <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
                    </div>
                )}

                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="product-title">{product.name}</h3>
                </Link>


                {/* Price Row logic */}
                {isAuthenticated ? (
                    <div className="product-price-row">
                        <span className="price-current">{product.price.toLocaleString('en-IN')}🪙</span>
                        {product.originalPrice && (
                            <span className="price-original">{product.originalPrice.toLocaleString('en-IN')}🪙</span>
                        )}
                        {discount > 0 && (
                            <span className="price-discount">{discount}% off</span>
                        )}
                    </div>
                ) : (
                    <div className="product-price-row">
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Login to view price</span>
                    </div>
                )}

                {/* Horizontal: Features chips */}
                {variant === 'horizontal' && (
                    <div className="product-features">
                        {features.map((f, i) => (
                            <span key={i} className="feature-tag">{f}</span>
                        ))}
                    </div>
                )}

                {/* Horizontal: Add to Cart button */}
                {isAuthenticated && variant === 'horizontal' && (
                    <div className="horizontal-actions">
                        <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard
