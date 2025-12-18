import { Laptop, Shirt, Watch, Sparkles, Gift } from 'lucide-react';

const CategoryIcons = ({ onSelectCategory, selectedCategory }) => {
    const categories = [
        { name: 'All', icon: '🏪', IconComponent: null },
        { name: 'Tech', icon: '💻', IconComponent: Laptop },
        { name: 'Apparel', icon: '👕', IconComponent: Shirt },
        { name: 'Accessories', icon: '⌚', IconComponent: Watch },
        { name: 'Experience', icon: '✨', IconComponent: Sparkles },
        { name: 'Mystery', icon: '🎁', IconComponent: Gift },
    ];

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Shop by Category</h2>

            {/* Horizontal Scrollable Container */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-4 min-w-max">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => onSelectCategory(category.name)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl min-w-[100px] transition-all duration-200 ${selectedCategory === category.name
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <div className="text-3xl">{category.icon}</div>
                            <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryIcons;
