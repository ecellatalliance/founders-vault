const PromotionalCards = ({ onSelectCategory }) => {
    const promos = [
        {
            title: 'Tech Essentials',
            subtitle: 'Gear up for success',
            category: 'Tech',
            gradient: 'from-purple-500 via-pink-500 to-red-500',
            imageUrl: '/images/tech_essentials_icon.png',
        },
        {
            title: 'Premium Apparel',
            subtitle: 'Dress like a founder',
            category: 'Apparel',
            gradient: 'from-orange-500 via-amber-500 to-yellow-500',
            imageUrl: '/images/premium_apparel_icon.png',
        },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {promos.map((promo, index) => (
                <button
                    key={index}
                    onClick={() => onSelectCategory(promo.category)}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-left shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                    }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative z-10 flex flex-col items-start h-full">
                        <div className="mb-4 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl p-2 shadow-inner">
                            <img
                                src={promo.imageUrl}
                                alt={promo.title}
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                        <p className="text-white/90 text-sm mb-4">{promo.subtitle}</p>
                        <div className="mt-auto inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
                            Shop Now
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default PromotionalCards;
