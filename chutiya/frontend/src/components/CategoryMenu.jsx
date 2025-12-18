import { X, Laptop, Shirt, Watch, Sparkles, Gift, Layers } from 'lucide-react';
import { useEffect } from 'react';

const CategoryMenu = ({ isOpen, onClose, onSelectCategory, selectedCategory }) => {
    const categories = [
        { name: 'All', icon: Layers, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        { name: 'Tech', icon: Laptop, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { name: 'Apparel', icon: Shirt, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { name: 'Accessories', icon: Watch, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
        { name: 'Experience', icon: Sparkles, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
        { name: 'Mystery', icon: Gift, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
    ];

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleCategoryClick = (categoryName) => {
        onSelectCategory(categoryName);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Categories</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Category List */}
                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.name;

                        return (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${isSelected
                                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-[1.02]'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <div
                                    className={`p-3 rounded-lg ${isSelected ? 'bg-white/20 dark:bg-black/20' : category.bgColor
                                        }`}
                                >
                                    <Icon
                                        size={24}
                                        className={isSelected ? 'text-white dark:text-black' : category.color}
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold">{category.name}</p>
                                    <p className={`text-xs ${isSelected ? 'text-white/70 dark:text-black/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                        Browse {category.name.toLowerCase()}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default CategoryMenu;
