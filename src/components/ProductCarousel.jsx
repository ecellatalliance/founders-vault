import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'

const ProductCarousel = ({ title, products, viewAllLink }) => {
    return (
        <section className="carousel-section">
            <div className="container">
                <div className="carousel-header">
                    <h2 className="carousel-title">{title}</h2>
                    {viewAllLink && (
                        <Link to={viewAllLink} className="carousel-view-all">
                            View All <i className="fas fa-arrow-right"></i>
                        </Link>
                    )}
                </div>
                <div className="carousel-container">
                    <div className="carousel-track">
                        {products.map((product) => (
                            <div key={product.id} className="carousel-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductCarousel
