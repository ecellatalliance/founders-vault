import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';

const Vaultie = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm Vaultie 🤖. Ask me anything about the E-Cell or startups!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Convert messages to Gemini history format if needed, 
            // for now just sending the last message as prompt context is handled in backend
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    }))
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "Oops! My brain is offline. 😵‍💫" }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Connection error! Check my backend. 🔌" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const variants = {
        float: {
            y: [0, -10, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        },
        hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 w-80 h-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-yellow-400 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black">
                                    <span className="text-lg">🤖</span>
                                </div>
                                <h3 className="font-bold text-slate-900">Vaultie Chat</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-900 hover:text-white transition">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 space-y-3">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-700">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Vaultie..."
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mascot Trigger */}
            <motion.div
                className="cursor-pointer relative group"
                variants={variants}
                animate="float"
                whileHover="hover"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="absolute -top-10 right-0 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-200 dark:border-slate-700">
                    Chat with me! 💬
                </div>
                <div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden relative">
                    <div className="absolute top-5 left-4 w-4 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                    </div>
                    <div className="absolute top-5 right-4 w-4 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                    </div>
                    <div className="absolute bottom-5 w-6 h-3 bg-black rounded-b-full" />
                </div>
            </motion.div>
        </div>
    );
};

export default Vaultie;
