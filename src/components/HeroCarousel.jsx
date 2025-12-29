import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const carouselStyles = [
    { background: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)', color: '#fff', button: { background: '#fff', color: '#090979', borderColor: '#fff' } },
    { background: 'linear-gradient(135deg, #FDB813 0%, #785C09 100%)', color: '#fff', button: { background: '#fff', color: '#785C09', borderColor: '#fff' } },
    { background: 'linear-gradient(to right, #000000 0%, #434343 100%)', color: '#FDB813', button: { background: '#FDB813', color: '#000', borderColor: '#FDB813' } },
    { background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#1e3a8a', button: { background: '#1e3a8a', color: '#fff', borderColor: '#1e3a8a' } },
    { background: 'linear-gradient(to top, #09203f 0%, #537895 100%)', color: '#fff', button: { background: '#fff', color: '#09203f', borderColor: '#fff' } }
]

const HeroCarousel = ({ products = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const navigate = useNavigate()
    const [slides, setSlides] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            // Transform products into slides
            const featuredProducts = products.filter(p => p.featured || p.price > 500).slice(0, 5)
            const slidesData = (featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5)).map((product, index) => {
                const style = carouselStyles[index % carouselStyles.length]
                const nameWords = product.name.split(' ')
                const title1 = nameWords[0] || 'NEW'
                const accent = nameWords.length > 1 ? nameWords[1] : 'ARRIVAL'
                const title2 = nameWords.slice(2).join(' ') || 'PRODUCT'

                return {
                    id: product.id,
                    image: product.image,
                    title1: title1.toUpperCase(),
                    accent: accent.toLowerCase(),
                    title2: title2.toUpperCase(),
                    subtitle: product.description ? product.description.substring(0, 50) + '...' : 'DISCOVER PREMIUM QUALITY',
                    cta: 'SHOP NOW',
                    link: `/product/${product.id}`,
                    style: { background: style.background, color: style.color },
                    buttonStyle: style.button
                }
            })
            setSlides(slidesData)
        } else {
            // Fallback default slides if no products provided
            setSlides([
                {
                    image: '/logo.svg', // Use logo as fallback
                    title1: 'WELCOME',
                    accent: 'to',
                    title2: 'FOUNDERS VAULT',
                    subtitle: 'PREMIUM STUDENT REWARDS',
                    cta: 'EXPLORE SHOP',
                    link: '/shop',
                    style: carouselStyles[0],
                    buttonStyle: carouselStyles[0].button
                }
            ])
        }
    }, [products])

    useEffect(() => {
        if (slides.length === 0) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [slides.length])

    const moveCarousel = (direction) => {
        if (slides.length === 0) return
        setCurrentSlide((prev) => (prev + direction + slides.length) % slides.length)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    if (slides.length === 0) return null

    return (
        <section className="hero-carousel">
            <div className="hero-carousel-container">
                <div
                    className="hero-carousel-track"
                    id="heroCarouselTrack"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="hero-carousel-slide" style={slide.style}>
                            <div className="hero-image-container">
                                <img src={slide.image} alt={slide.title2 || 'Product'} />
                            </div>
                            <div className="hero-content-container">
                                <div className="hero-text-explore" style={{ color: slide.style?.color || 'inherit' }}>{slide.title1}</div>
                                <div className="hero-text-the" style={{ color: slide.style?.color || 'var(--accent-gold)' }}>{slide.accent}</div>
                                <div className="hero-text-latest" style={{ color: slide.style?.color || 'inherit' }}>{slide.title2}</div>
                                <div className="hero-text-sub" style={{ color: slide.style?.color || 'inherit' }}>{slide.subtitle}</div>
                                <button
                                    className="hero-btn-shop"
                                    onClick={() => navigate(slide.link)}
                                    style={{
                                        borderColor: slide.buttonStyle?.borderColor || 'var(--accent-gold)',
                                        color: slide.buttonStyle?.color || 'var(--bg-primary)',
                                        backgroundColor: slide.buttonStyle?.background || 'var(--accent-gold)'
                                    }}
                                >
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {slides.length > 1 && (
                    <>
                        <button
                            className="hero-carousel-btn hero-carousel-prev"
                            onClick={() => moveCarousel(-1)}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            className="hero-carousel-btn hero-carousel-next"
                            onClick={() => moveCarousel(1)}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        <div className="hero-carousel-dots" id="heroCarouselDots">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`hero-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default HeroCarousel
