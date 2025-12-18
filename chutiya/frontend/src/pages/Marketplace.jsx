import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useCategory } from '../context/CategoryContext';
import HeroBanner from '../components/HeroBanner';
import CategoryIcons from '../components/CategoryIcons';
import BrandShowcase from '../components/BrandShowcase';
import PromotionalCards from '../components/PromotionalCards';
import HorizontalCarousel from '../components/HorizontalCarousel';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { selectedCategory: contextCategory, setSelectedCategory: setContextCategory } = useCategory();

    useEffect(() => {
        fetch('http://localhost:5000/api/shop/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    // Sync with context category from hamburger menu
    useEffect(() => {
        if (contextCategory && contextCategory !== 'All') {
            setContextCategory(contextCategory);
        }
    }, [contextCategory, setContextCategory]);

    const handleCategorySelect = (category) => {
        setContextCategory(category);
    };

    // Filter products based on selected category
    const filteredProducts = contextCategory && contextCategory !== 'All'
        ? products.filter(p => p.category === contextCategory)
        : products;

    // Get top picks (first 8 products)
    const topPicks = products.slice(0, 8);

    // Get featured products (filtered or all)
    const featuredProducts = filteredProducts.slice(0, 8);

    return (
        <div>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Category Icons */}
            <CategoryIcons
                onSelectCategory={handleCategorySelect}
                selectedCategory={contextCategory || 'All'}
            />

            {/* Brand Showcase */}
            <BrandShowcase />

            {/* Promotional Cards */}
            <PromotionalCards onSelectCategory={handleCategorySelect} />

            {/* Top Picks Carousel */}
            {contextCategory === 'All' && topPicks.length > 0 && (
                <HorizontalCarousel
                    title="Top Picks"
                    products={topPicks}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={isInWishlist}
                    showViewAll={true}
                />
            )}

            {/* Featured Products Carousel */}
            {featuredProducts.length > 0 && (
                <HorizontalCarousel
                    title={contextCategory && contextCategory !== 'All' ? `${contextCategory} Products` : 'Featured Products'}
                    products={featuredProducts}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={isInWishlist}
                    showViewAll={contextCategory !== 'All'}
                />
            )}

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
