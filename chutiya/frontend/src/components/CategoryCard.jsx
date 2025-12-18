import { Laptop, Shirt, Watch, Sparkles, Gift, ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, productCount, onClick }) => {
    const categoryConfig = {
        Tech: {
            icon: Laptop,
            color: 'from-blue-500 to-cyan-500',
            bgPattern: 'bg-blue-50 dark:bg-blue-900/20',
            emoji: '💻',
        },
        Apparel: {
            icon: Shirt,
            color: 'from-green-500 to-emerald-500',
            bgPattern: 'bg-green-50 dark:bg-green-900/20',
            emoji: '👕',
        },
        Accessories: {
            icon: Watch,
            color: 'from-orange-500 to-amber-500',
            bgPattern: 'bg-orange-50 dark:bg-orange-900/20',
            emoji: '⌚',
        },
        Experience: {
            icon: Sparkles,
            color: 'from-pink-500 to-rose-500',
            bgPattern: 'bg-pink-50 dark:bg-pink-900/20',
            emoji: '✨',
        },
        Mystery: {
            icon: Gift,
            color: 'from-purple-500 to-violet-500',
            bgPattern: 'bg-purple-50 dark:bg-purple-900/20',
            emoji: '🎁',
        },
    };

    const config = categoryConfig[category] || categoryConfig.Tech;
    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-transparent text-left w-full"
        >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Pattern Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${config.bgPattern} rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`} />

            <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${config.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} />
                </div>

                {/* Category Info */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    {category}
                    <span className="text-3xl">{config.emoji}</span>
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {productCount} {productCount === 1 ? 'product' : 'products'} available
                </p>

                {/* Browse Button */}
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:gap-4 transition-all duration-300">
                    Browse {category}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </button>
    );
};

export default CategoryCard;
