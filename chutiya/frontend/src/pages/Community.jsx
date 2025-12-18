import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Bell } from 'lucide-react';

const Community = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/community/announcements')
            .then(res => res.json())
            .then(data => setAnnouncements(data))
            .catch(err => console.error(err));
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'event': return <Calendar className="text-blue-500" />;
            case 'alert': return <Bell className="text-red-500" />;
            default: return <Megaphone className="text-yellow-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Community Hub 📢</h1>
                <p className="text-slate-500 dark:text-slate-400">Stay updated with the latest news, drops, and events.</p>
            </div>

            <div className="space-y-6">
                {announcements.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-400">No announcements yet. Check back soon!</p>
                    </div>
                ) : (
                    announcements.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl dark:text-white">{item.title}</h3>
                                        <span className="text-xs text-slate-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <span>Posted by {item.author}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Community;
