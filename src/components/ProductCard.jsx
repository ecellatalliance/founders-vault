import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useCart()

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fas fa-star"></i>)
        }
        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt"></i>)
        }
        const emptyStars = 5 - Math.ceil(rating)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>)
        }
        return stars
    }

    return (
        <div className="product-card">
            <div className="product-card-image">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
                    }}
                />
                {discount > 0 && (
                    <span className="product-card-badge">{discount}% OFF</span>
                )}
                {product.stock < 10 && product.stock > 0 && (
                    <span className="product-card-badge" style={{ left: 'auto', right: 'var(--space-3)', backgroundColor: 'var(--error)' }}>
                        Only {product.stock} left
                    </span>
                )}
            </div>

            <div className="product-card-actions">
                <button
                    className="product-card-action-btn"
                    onClick={() => toggleWishlist(product)}
                    title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                </button>
                <button className="product-card-action-btn" title="Quick View">
                    <i className="fas fa-eye"></i>
                </button>
            </div>

            <div className="product-card-content">
                <div className="product-card-category">{product.category}</div>
                <h3 className="product-card-title">{product.name}</h3>

                <div className="product-card-rating">
                    <div className="product-card-stars">
                        {renderStars(product.rating)}
                    </div>
                    <span className="product-card-reviews">({product.reviews})</span>
                </div>

                <div className="product-card-price">
                    <span className="product-card-price-current">{product.price.toLocaleString('en-IN')}🪙</span>
                    {product.originalPrice && (
                        <span className="product-card-price-original">{product.originalPrice.toLocaleString('en-IN')}🪙</span>
                    )}
                    {discount > 0 && (
                        <span className="product-card-discount">{discount}% OFF</span>
                    )}
                </div>

                <div className="product-card-footer">
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? (
                            <>
                                <i className="fas fa-ban"></i>
                                Out of Stock
                            </>
                        ) : (
                            <>
                                <i className="fas fa-shopping-cart"></i>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
