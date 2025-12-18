import { useShop } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart } = useShop();

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Your wishlist is empty.</p>
                    <Link to="/shop" className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline">Explore Rewards</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <div key={product._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all group relative">
                            <div className="relative h-64 bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-700 text-red-500 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="p-5">
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{product.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{product.description}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-500">{product.cost} VC</span>
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
                                    >
                                        <ShoppingCart size={16} />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
