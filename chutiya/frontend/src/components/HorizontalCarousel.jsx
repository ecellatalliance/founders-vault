import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

const HorizontalCarousel = ({ title, products, onAddToCart, onToggleWishlist, isInWishlist, showViewAll = true }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(checkScrollButtons, 300);
        }
    };

    return (
        <div className="mb-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                {showViewAll && (
                    <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-medium">
                        View All →
                    </button>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative group">
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <ChevronLeft size={24} className="text-slate-900 dark:text-white" />
                    </button>
                )}

                {/* Products Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex-none w-64 bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            <div className="relative h-56 bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />

                                {/* Wishlist Button */}
                                <button
                                    onClick={() => onToggleWishlist(product)}
                                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors ${isInWishlist(product._id)
                                        ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                                        : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500'
                                        }`}
                                >
                                    <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                                </button>

                                {product.stock < 5 && (
                                    <span className="absolute top-3 left-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 rounded">
                                        Low Stock
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-1 line-clamp-1">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-500">
                                        {product.cost} VC
                                    </span>
                                    <button
                                        onClick={() => onAddToCart(product._id)}
                                        disabled={product.stock === 0}
                                        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <ShoppingCart size={16} />
                                        {product.stock === 0 ? 'Sold Out' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <ChevronRight size={24} className="text-slate-900 dark:text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default HorizontalCarousel;
