import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const carouselSlides = [
    {
        image: '/assets/images/products/Mystery Box.png',
        title1: 'EXPLORE',
        accent: 'the',
        title2: 'MYSTERY',
        subtitle: 'UNBOX YOUR SURPRISE TODAY!',
        cta: 'SHOP NOW',
        link: '/shop?category=Mystery',
        style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' } // Deep Purple
    },
    {
        image: '/assets/images/products/Hoodies.png',
        title1: 'WEAR',
        accent: 'the',
        title2: 'VIBE',
        subtitle: 'PREMIUM CAMPUS APPAREL',
        cta: 'EXPLORE',
        link: '/shop?category=Premium Apparel',
        style: { background: 'linear-gradient(to right, #ff512f, #dd2476)', color: '#fff' } // Vibrant Red/Pink
    },
    {
        image: '/assets/images/products/Gaming Headset.png',
        title1: 'LEVEL',
        accent: 'up',
        title2: 'YOUR GAME',
        subtitle: 'IMMERSIVE AUDIO EXPERIENCE',
        cta: 'BUY NOW',
        link: '/shop?category=Tech Essentials',
        style: { background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', color: '#fff' } // Dark Tech Blue
    },
    {
        image: '/assets/images/products/Mechanical Keyboard.png',
        title1: 'TYPE',
        accent: 'with',
        title2: 'STYLE',
        subtitle: 'MECHANICAL PRECISION',
        cta: 'GET YOURS',
        link: '/shop?category=Tech Essentials',
        style: { background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', color: '#1a1a1a' } // Mint/Blue (Dark Text)
    },
    {
        image: '/assets/images/products/Mentorship Session.png',
        title1: 'LEARN',
        accent: 'from',
        title2: 'LEADERS',
        subtitle: 'BOOK YOUR SESSION',
        cta: 'BOOK NOW',
        link: '/shop?category=Books & Learning',
        style: { background: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)', color: '#fff' } // Bright Blue
    }
]

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const moveCarousel = (direction) => {
        setCurrentSlide((prev) => (prev + direction + carouselSlides.length) % carouselSlides.length)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    return (
        <section className="hero-carousel">
            <div className="hero-carousel-container">
                <div
                    className="hero-carousel-track"
                    id="heroCarouselTrack"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {carouselSlides.map((slide, index) => (
                        <div key={index} className="hero-carousel-slide" style={slide.style}>
                            <div className="hero-image-container">
                                <img src={slide.image} alt={slide.title2} />
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
                                        borderColor: slide.style?.color || 'var(--accent-gold)',
                                        color: slide.style?.color || 'var(--bg-primary)',
                                        backgroundColor: slide.style?.color || 'var(--accent-gold)'
                                    }}
                                >
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HeroCarousel
