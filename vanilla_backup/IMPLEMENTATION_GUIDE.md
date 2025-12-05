# Implementation Guide for E-Store Updates

## Completed ✅

### 1. Products Updated
- Updated `products.json` with 14 products matching available images
- Prices range from 50 VC to 5000 VC (sorted cheapest first)
- All images correctly mapped to `/assets/images/products/`

### 2. CSS Styles Created
- Created `css/hero-carousel.css` with styles for:
  - Hero image carousel
  - Account dropdown menu
  - How to Earn VC section
  - Updated header layout

## Remaining Implementation Steps

### Step 1: Update index.html Header Section

Replace lines 38-74 in index.html with:

```html
        <!-- Main Header -->
        <div class="header-main">
            <div class="container">
                <div class="header-main-content">
                    <!-- VC Balance -->
                    <div class="vc-balance" id="vcBalance">
                        <i class="fas fa-coins"></i>
                        <span id="vcAmount">0 VC</span>
                    </div>

                    <!-- Search Bar -->
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" class="search-input" id="searchInput"
                            placeholder="Search for products, categories...">
                        <button class="search-btn" onclick="performSearch()">Search</button>
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <button class="header-action-btn" onclick="window.location.href='wishlist.html'">
                            <i class="fas fa-heart header-action-icon"></i>
                            <span class="header-action-label">Wishlist</span>
                            <span class="header-action-badge" id="wishlistCount">0</span>
                        </button>

                        <button class="header-action-btn" onclick="window.location.href='cart.html'">
                            <i class="fas fa-shopping-cart header-action-icon"></i>
                            <span class="header-action-label">Cart</span>
                            <span class="header-action-badge" id="cartCount">0</span>
                        </button>

                        <!-- Account with Dropdown -->
                        <div class="account-dropdown">
                            <button class="header-action-btn" id="userBtn">
                                <i class="fas fa-user header-action-icon"></i>
                                <span class="header-action-label" id="userLabel">Account</span>
                            </button>
                            <div class="account-dropdown-menu">
                                <button class="theme-toggle-item" onclick="toggleTheme()">
                                    <i class="fas fa-moon" id="themeIcon"></i>
                                    <span id="themeLabel">Dark Mode</span>
                                </button>
                                <a href="dashboard.html" class="dropdown-item">
                                    <i class="fas fa-user-circle"></i>
                                    <span>My Account</span>
                                </a>
                                <a href="login.html" class="dropdown-item" id="loginLink">
                                    <i class="fas fa-sign-in-alt"></i>
                                    <span>Login</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
```

### Step 2: Update Navigation (lines 71-81)

Replace with:

```html
                    <ul class="nav-links" id="navLinks">
                        <li><a href="index.html" class="nav-link active">Home</a></li>
                        <li><a href="shop.html" class="nav-link">Shop</a></li>
                        <li><a href="#earn-vc" class="nav-link">How to Earn VC</a></li>
                        <li><a href="community.html" class="nav-link">Announcements📢</a></li>
                        <li><a href="#about" class="nav-link">About E-Cell</a></li>
                    </ul>
```

### Step 3: Replace Hero Section (lines 92-111)

Replace with:

```html
    <!-- Hero Image Carousel -->
    <section class="hero-carousel">
        <div class="hero-carousel-container">
            <div class="hero-carousel-track" id="heroCarouselTrack">
                <!-- Carousel slides will be added by JavaScript -->
            </div>
            <button class="hero-carousel-btn hero-carousel-prev" onclick="moveHeroCarousel(-1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="hero-carousel-btn hero-carousel-next" onclick="moveHeroCarousel(1)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="hero-carousel-dots" id="heroCarouselDots"></div>
        </div>
    </section>
```

### Step 4: Add "How to Earn VC" Section

Add after the "Student Startups Collection" section (around line 247):

```html
    <!-- How to Earn VC Section -->
    <section class="earn-vc-section" id="earn-vc">
        <div class="container">
            <div class="earn-vc-content">
                <h2 class="earn-vc-title">💰 How to Earn VC Points</h2>
                <p class="earn-vc-subtitle">Earn Virtual Currency and redeem amazing products!</p>
                
                <div class="earn-vc-grid">
                    <div class="earn-vc-card">
                        <span class="earn-vc-icon">🎯</span>
                        <h3 class="earn-vc-card-title">Participate in Events</h3>
                        <p class="earn-vc-card-description">
                            Attend workshops, seminars, and E-Cell events to earn VC points for your participation.
                        </p>
                        <span class="earn-vc-amount">+100 VC per event</span>
                    </div>

                    <div class="earn-vc-card">
                        <span class="earn-vc-icon">🏆</span>
                        <h3 class="earn-vc-card-title">Win Competitions</h3>
                        <p class="earn-vc-card-description">
                            Compete in hackathons, pitch competitions, and challenges to win big VC rewards!
                        </p>
                        <span class="earn-vc-amount">+500-2000 VC</span>
                    </div>

                    <div class="earn-vc-card">
                        <span class="earn-vc-icon">🚀</span>
                        <h3 class="earn-vc-card-title">Register Your Startup</h3>
                        <p class="earn-vc-card-description">
                            Register your student startup with E-Cell and get VC points to kickstart your journey.
                        </p>
                        <span class="earn-vc-amount">+1000 VC</span>
                    </div>

                    <div class="earn-vc-card">
                        <span class="earn-vc-icon">🤝</span>
                        <h3 class="earn-vc-card-title">Refer Friends</h3>
                        <p class="earn-vc-card-description">
                            Invite your friends to join E-Cell Store and earn VC for every successful referral.
                        </p>
                        <span class="earn-vc-amount">+200 VC per referral</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
```

### Step 5: Add JavaScript for Hero Carousel

Create `js/hero-carousel.js`:

```javascript
// Hero Carousel Functionality
let currentSlide = 0;
const carouselImages = [
    '/assets/images/products/Mystery Box.png',
    '/assets/images/products/E-Cell Hoodie.png',
    '/assets/images/products/Gaming Headset.png',
    '/assets/images/products/Mechanical Keyboard.png'
];

function initHeroCarousel() {
    const track = document.getElementById('heroCarouselTrack');
    const dotsContainer = document.getElementById('heroCarouselDots');
    
    if (!track || !dotsContainer) return;
    
    // Create slides
    carouselImages.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-carousel-slide';
        slide.innerHTML = `<img src="${img}" alt="Featured Product ${index + 1}">`;
        track.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'hero-carousel-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Auto-play
    setInterval(() => moveHeroCarousel(1), 5000);
}

function moveHeroCarousel(direction) {
    currentSlide = (currentSlide + direction + carouselImages.length) % carouselImages.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
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
```

### Step 6: Update index.html to include new scripts

Add before closing `</body>` tag:

```html
    <script src="js/hero-carousel.js"></script>
```

## Summary

All the CSS is ready in `css/hero-carousel.css`. You need to:
1. Manually update the HTML sections as described above
2. Create the `js/hero-carousel.js` file
3. Link the new JavaScript file in index.html

This approach avoids file corruption and gives you full control over the implementation.
