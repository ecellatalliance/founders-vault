import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, updateQuantity, cartTotal, cartCount } = useShop();
    const { user, refreshUser } = useAuth();

    const handleCheckout = async () => {
        if (user.balance < cartTotal) {
            return alert("Insufficient Venture Credits! Keep building to earn more.");
        }

        if (!confirm(`Redeem all items for ${cartTotal} VC?`)) return;

        // Process each item
        for (const item of cart) {
            try {
                await fetch('http://localhost:5000/api/shop/redeem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user._id,
                        productId: item.product._id,
                        quantity: item.quantity
                    })
                });
                // Remove from cart after success
                await updateQuantity(item.product._id, 0);
            } catch (err) {
                console.error("Failed to redeem", item.product.title);
            }
        }

        alert("Redemption Successful! 🎉 Check your dashboard.");
        refreshUser();
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-slate-400 dark:text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't found anything yet.</p>
                <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart ({cartCount})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                        <div key={item.product._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4 items-center shadow-sm">
                            <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-contain bg-slate-50 dark:bg-slate-700 rounded-lg" />

                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.product.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.product.cost} VC each</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-slate-600 dark:text-slate-300"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-mono font-bold w-6 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-slate-600 dark:text-slate-300"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="text-right min-w-[80px]">
                                <div className="font-bold text-yellow-600 dark:text-yellow-500">{item.product.cost * item.quantity} VC</div>
                            </div>

                            <button
                                onClick={() => updateQuantity(item.product._id, 0)}
                                className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                        <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Order Summary</h3>

                        <div className="flex justify-between mb-4 text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>{cartTotal} VC</span>
                        </div>
                        <div className="flex justify-between mb-6 text-slate-600 dark:text-slate-400">
                            <span>Taxes</span>
                            <span>0 VC</span>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between mb-8">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                            <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-500">{cartTotal} VC</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            Redeem Now
                        </button>

                        <p className="text-xs text-center text-slate-400 mt-4">
                            By redeeming, you agree to the Vault terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
