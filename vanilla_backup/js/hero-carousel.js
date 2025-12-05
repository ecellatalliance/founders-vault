// ============================================
// HERO CAROUSEL - Lifestyle Split Layout
// ============================================

let currentSlide = 0;
let carouselInterval;

// Carousel Data
const carouselSlides = [
    {
        image: 'assets/images/products/Mystery Box.png',
        title1: 'EXPLORE',
        accent: 'the',
        title2: 'MYSTERY',
        subtitle: 'UNBOX YOUR SURPRISE TODAY!',
        cta: 'SHOP NOW',
        link: 'shop.html?category=Mystery'
    },
    {
        image: 'assets/images/products/Hoodies.png',
        title1: 'WEAR',
        accent: 'the',
        title2: 'VIBE',
        subtitle: 'PREMIUM CAMPUS APPAREL',
        cta: 'EXPLORE',
        link: 'shop.html?category=Apparel'
    },
    {
        image: 'assets/images/products/Gaming Headset.png',
        title1: 'LEVEL',
        accent: 'up',
        title2: 'YOUR GAME',
        subtitle: 'IMMERSIVE AUDIO EXPERIENCE',
        cta: 'BUY NOW',
        link: 'shop.html?category=Tech'
    },
    {
        image: 'assets/images/products/Mechanical Keyboard.png',
        title1: 'TYPE',
        accent: 'with',
        title2: 'STYLE',
        subtitle: 'MECHANICAL PRECISION',
        cta: 'GET YOURS',
        link: 'shop.html?category=Tech'
    },
    {
        image: 'assets/images/products/Mentorship Session.png',
        title1: 'LEARN',
        accent: 'from',
        title2: 'LEADERS',
        subtitle: 'BOOK YOUR SESSION',
        cta: 'BOOK NOW',
        link: 'shop.html?category=Learning'
    }
];

function initHeroCarousel() {
    const track = document.getElementById('heroCarouselTrack');
    const dotsContainer = document.getElementById('heroCarouselDots');

    if (!track || !dotsContainer) return;

    // Clear existing content
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Create slides
    carouselSlides.forEach((slideData, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-carousel-slide';

        slide.innerHTML = `
            <div class="hero-image-container">
                <img src="${slideData.image}" alt="${slideData.title2}">
            </div>
            <div class="hero-content-container">
                <div class="hero-text-explore">${slideData.title1}</div>
                <div class="hero-text-the">${slideData.accent}</div>
                <div class="hero-text-latest">${slideData.title2}</div>
                <div class="hero-text-sub">${slideData.subtitle}</div>
                <button class="hero-btn-shop" onclick="window.location.href='${slideData.link}'">
                    ${slideData.cta}
                </button>
            </div>
        `;
        track.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = 'hero-carousel-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Auto-play carousel every 5 seconds
    startAutoPlay();
}

function startAutoPlay() {
    stopAutoPlay(); // Ensure no duplicate intervals
    carouselInterval = setInterval(() => moveHeroCarousel(1), 5000);
}

function stopAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

function moveHeroCarousel(direction) {
    stopAutoPlay();
    currentSlide = (currentSlide + direction + carouselSlides.length) % carouselSlides.length;
    updateCarousel();
    startAutoPlay();
}

function goToSlide(index) {
    stopAutoPlay();
    currentSlide = index;
    updateCarousel();
    startAutoPlay();
}

function updateCarousel() {
    const track = document.getElementById('heroCarouselTrack');
    const dots = document.querySelectorAll('.hero-carousel-dot');

    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCarousel);
} else {
    initHeroCarousel();
}
