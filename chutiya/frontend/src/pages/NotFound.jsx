import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-400 text-center p-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <h1 className="text-9xl font-black text-black mb-4">404</h1>
            </motion.div>

            <h2 className="text-2xl font-bold text-black mb-8">Oops! You wandered off the map.</h2>

            <div className="mb-8">
                {/* Dancing Banana GIF Placeholder */}
                <img
                    src="https://media.giphy.com/media/IB9foBA4PVkKa1ALD5/giphy.gif"
                    alt="Dancing Banana"
                    className="w-48 h-48 mx-auto rounded-full border-4 border-black shadow-xl"
                />
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-black transform -rotate-2 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-mono text-sm font-bold text-slate-500">SECRET COUPON</p>
                <p className="text-xl font-black tracking-widest text-black">BANANA_SPLIT_25</p>
            </div>

            <Link
                to="/"
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
                Take Me Home
            </Link>
        </div>
    );
};

export default NotFound;
