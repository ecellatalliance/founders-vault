import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const products = [
        {
            main: '/images/products/Gaming Headset.png',
            secondary: [
                '/images/products/Mechanical Keyboard.png',
                '/images/products/Laptop Sticker Pack.png'
            ]
        },
        {
            main: '/images/products/Hoodies.png',
            secondary: [
                '/images/products/coffee_mugs.png',
                '/images/products/journal.png'
            ]
        },
        {
            main: '/images/products/Mystery Box.png',
            secondary: [
                '/images/products/planner.png',
                '/images/products/highlighter_set.png'
            ]
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [products.length]);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black rounded-2xl mb-8">
            <div className="max-w-7xl mx-auto px-8 py-16 md:py-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Product Carousel */}
                    <div className="relative h-96">
                        {products.map((productSet, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-6 h-full">
                                    {/* Main Product - Center */}
                                    <div className="transform hover:scale-105 transition-transform duration-300">
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-600/30">
                                            <img
                                                src={productSet.main}
                                                alt="Featured Product"
                                                className="w-48 h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Secondary Products */}
                                    <div className="flex flex-col gap-4">
                                        {productSet.secondary.map((img, idx) => (
                                            <div key={idx} className="bg-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform border border-slate-600/30">
                                                <img
                                                    src={img}
                                                    alt={`Product ${idx + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl -z-0" />
                    </div>

                    {/* Right Side - Tagline & CTA */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Redeem rewards that fuel your journey
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-xl">
                            Turn your Venture Credits into premium products, exclusive experiences, and amazing rewards.
                        </p>
                        <button className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto md:mx-0">
                            Up to 50% off with VC
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <p className="text-xs text-slate-400 mt-3">*Terms and conditions apply</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
