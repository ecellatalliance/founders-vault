import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-yellow-400 rounded-full"
            />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading Vault...</p>
        </div>
    );
};

export default LoadingSpinner;
