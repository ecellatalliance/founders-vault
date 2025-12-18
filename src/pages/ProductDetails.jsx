import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Layout from '../components/Layout'
import { useProducts } from '../hooks/useProducts'
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
            <main className="product-details-main" style={{ padding: 'var(--space-4) 0', backgroundColor: '#fff' }}>
                <div className="container">
                    {/* Breadcrumbs */}
                    <div style={{ marginBottom: 'var(--space-4)', color: '#565959', fontSize: '0.85rem' }}>
                        <span style={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/shop')}>Back to results</span>
                        {' › '}
                        <span style={{ color: '#C7511F', cursor: 'pointer' }}>{product.category}</span>
                    </div>

                    <div className="product-grid-amazon" style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 4.5fr) minmax(0, 4.5fr) minmax(0, 2.5fr)',
                        gap: 'var(--space-8)',
                        alignItems: 'start'
                    }}>

                        {/* 1. Left Column: Images */}
                        <div className="product-gallery-section" style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            {/* Thumbnails (Vertical) */}
                            <div className="thumbnails-vertical" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {[product.image].map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '40px',
                                            height: '50px',
                                            border: selectedImage === i ? '1px solid #e77600' : '1px solid #a2a6ac',
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: selectedImage === i ? '0 0 3px 2px rgba(228,121,17,0.5)' : 'none'
                                        }}
                                        onMouseEnter={() => setSelectedImage(i)}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="main-image-wrapper" style={{ flex: 1, textAlign: 'center' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* 2. Center Column: Details */}
                        <div className="product-dateils-center">
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.3, marginBottom: 'var(--space-1)', color: '#0F1111' }}>
                                {product.name}
                            </h1>
                            <div style={{ fontSize: '0.9rem', color: '#007185', marginBottom: 'var(--space-2)' }}>
                                Brand: E-Cell Store
                            </div>

                            {/* Ratings */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid #e7e7e7', paddingBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', color: '#F0C14B', fontSize: '0.9rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < Math.floor(product.rating || 4) ? '' : 'text-gray-300'}`} style={{ color: i < Math.floor(product.rating || 4) ? '#FFA41C' : '#e5e7eb' }}></i>
                                    ))}
                                </div>
                                <span style={{ color: '#007185', fontSize: '0.9rem' }}>{product.reviews || 12} ratings</span>
                            </div>

                            {/* Price Section */}
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                {isAuthenticated ? (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
                                            <span style={{ fontSize: '0.85rem', position: 'relative', top: '4px' }}>🪙</span>
                                            <span style={{ fontSize: '1.75rem', fontWeight: 500 }}>{product.price}</span>
                                        </div>
                                        {product.originalPrice > product.price && (
                                            <div style={{ color: '#565959', fontSize: '0.9rem' }}>
                                                List Price: <span style={{ textDecoration: 'line-through' }}>🪙{product.originalPrice}</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ color: '#B12704', fontWeight: 700 }}>
                                        Login to view price
                                    </div>
                                )}
                            </div>

                            {/* Bullet Points */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>About this item</h3>
                                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-5)', fontSize: '0.9rem', lineHeight: '1.5', color: '#0F1111' }}>
                                    {product.features ? product.features.map((feature, index) => (
                                        <li key={index} style={{ marginBottom: '4px' }}>{feature}</li>
                                    )) : (
                                        <>
                                            <li>High quality guaranteed by E-Cell.</li>
                                            <li>Ideal for students and founders.</li>
                                            <li>Available for immediate pickup upon approval.</li>
                                        </>
                                    )}
                                    <li>Description: {product.description}</li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Right Column: Buy Box */}
                        <div className="product-buy-box" style={{
                            border: '1px solid #d5d9d9',
                            borderRadius: '8px',
                            padding: 'var(--space-4)',
                            backgroundColor: '#fff'
                        }}>
                            {isAuthenticated ? (
                                <>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 500, color: '#B12704', marginBottom: 'var(--space-2)' }}>
                                        🪙{product.price}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#007185', marginBottom: 'var(--space-2)' }}>
                                        FREE Pickup
                                    </div>
                                    <div style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
                                        Order now and we'll notify you when it's ready.
                                    </div>
                                    <div style={{ fontSize: '1.1rem', color: product.stock > 0 ? '#007600' : '#B12704', marginBottom: 'var(--space-4)' }}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            style={{
                                                backgroundColor: '#FFD814',
                                                borderColor: '#FCD200',
                                                borderRadius: '20px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
                                                borderStyle: 'solid',
                                                borderWidth: '1px',
                                                width: '100%',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={product.stock === 0}
                                            style={{
                                                backgroundColor: '#FFA41C',
                                                borderColor: '#FF8F00',
                                                borderRadius: '20px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
                                                borderStyle: 'solid',
                                                borderWidth: '1px',
                                                width: '100%',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)', fontSize: '0.85rem', color: '#565959' }}>
                                        <i className="fas fa-lock"></i>
                                        <span>Secure transaction</span>
                                    </div>

                                    <div style={{ marginTop: 'var(--space-4)', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '10px', rowGap: '5px', color: '#565959' }}>
                                        <span>Sold by</span>
                                        <span style={{ color: '#007185' }}>E-Cell Store</span>
                                        <span>Ships from</span>
                                        <span style={{ color: '#007185' }}>Founders Vault</span>
                                    </div>

                                    {/* Wishlist */}
                                    <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid #d5d9d9', paddingTop: 'var(--space-2)' }}>
                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#007185',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`} style={{ marginRight: '5px', color: isInWishlist(product.id) ? '#B12704' : 'inherit' }}></i>
                                            Add to Wish List
                                        </button>
                                    </div>

                                </>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => navigate('/login')}
                                        style={{
                                            backgroundColor: '#FFD814',
                                            borderColor: '#FCD200',
                                            borderRadius: '20px',
                                            padding: '8px 20px',
                                            cursor: 'pointer',
                                            borderStyle: 'solid',
                                            borderWidth: '1px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Sign in to Buy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lower Section: Specs & Reviews */}
                    <div style={{ marginTop: 'var(--space-8)', borderTop: '1px solid #e7e7e7', paddingTop: 'var(--space-6)' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <h2 style={{ fontSize: '1.3rem', color: '#C7511F', marginBottom: 'var(--space-4)' }}>Product Information</h2>

                            {/* Specs Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: 'var(--space-8)' }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                                        <th style={{ textAlign: 'left', padding: '10px', backgroundColor: '#f3f3f3', width: '30%', color: '#565959', fontWeight: 500 }}>Brand</th>
                                        <td style={{ padding: '10px' }}>E-Cell Store</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                                        <th style={{ textAlign: 'left', padding: '10px', backgroundColor: '#f3f3f3', width: '30%', color: '#565959', fontWeight: 500 }}>Category</th>
                                        <td style={{ padding: '10px' }}>{product.category}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                                        <th style={{ textAlign: 'left', padding: '10px', backgroundColor: '#f3f3f3', width: '30%', color: '#565959', fontWeight: 500 }}>Stock Status</th>
                                        <td style={{ padding: '10px' }}>{product.stock > 0 ? 'Available' : 'Unavailable'}</td>
                                    </tr>
                                    {/* Mock specs since we don't have them in DB yet */}
                                    {['Mechanical Keyboard', 'Gaming Headset'].includes(product.name) && (
                                        <>
                                            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                                                <th style={{ textAlign: 'left', padding: '10px', backgroundColor: '#f3f3f3', width: '30%', color: '#565959', fontWeight: 500 }}>Connectivity</th>
                                                <td style={{ padding: '10px' }}>Wireless / USB-C</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                                                <th style={{ textAlign: 'left', padding: '10px', backgroundColor: '#f3f3f3', width: '30%', color: '#565959', fontWeight: 500 }}>Color</th>
                                                <td style={{ padding: '10px' }}>Black / RGB</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>

                            <h2 style={{ fontSize: '1.3rem', color: '#C7511F', marginBottom: 'var(--space-4)' }}>Customer Reviews</h2>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                <div style={{ display: 'flex', color: '#FFA41C' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < Math.floor(product.rating || 4) ? '' : 'text-gray-300'}`}></i>
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.9rem' }}>4.5 out of 5</span>
                            </div>
                            <p style={{ marginTop: 'var(--space-2)', fontSize: '0.9rem' }}>
                                "Great product, highly recommended for students!" - <span style={{ color: '#565959' }}>Verified Purchase</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default ProductDetails
