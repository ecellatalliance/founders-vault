import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ products }) => {
    const [index, setIndex] = useState(0);
    const featured = products.slice(0, 5); // Show top 5 products

    useEffect(() => {
        // Auto-scroll timer
        window.carouselTimer = setInterval(() => {
            setIndex((prev) => (prev + 1) % featured.length);
        }, 5000);
        return () => clearInterval(window.carouselTimer);
    }, [featured.length]);

    const next = () => setIndex((prev) => (prev + 1) % featured.length);
    const prev = () => setIndex((prev) => (prev - 1 + featured.length) % featured.length);

    if (featured.length === 0) return null;

    return (
        <div
            className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden mb-12 shadow-2xl group cursor-pointer"
            onMouseEnter={() => clearInterval(window.carouselTimer)}
            onMouseLeave={() => {
                window.carouselTimer = setInterval(() => {
                    setIndex((prev) => (prev + 1) % featured.length);
                }, 5000);
            }}
            onClick={() => alert(`Viewing details for ${featured[index].title}`)}
        >
            <AnimatePresence mode='wait'>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
                    <img
                        src={featured[index].image}
                        alt={featured[index].title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />

                    <div className="relative z-20 flex flex-col items-start justify-center w-full px-16 text-white">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs mb-4 uppercase tracking-wider"
                        >
                            Featured Drop
                        </motion.span>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl font-display font-bold mb-4 max-w-xl"
                        >
                            {featured[index].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-200 mb-8 max-w-lg"
                        >
                            {featured[index].description}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <span className="text-3xl font-bold text-yellow-400">{featured[index].cost} VC</span>
                            <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-slate-200 transition-colors">
                                View Details
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {featured.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-yellow-400 w-6' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;
