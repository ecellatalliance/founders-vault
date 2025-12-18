import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/users/profile/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update password' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server Error' });
        }
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user.name}!</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and settings here.</p>
            </div>

            <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="text-xl">⚡</span>
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                                +50
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Daily Login Bonus</p>
                                <p className="text-xs text-slate-500">Just now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                🛍️
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Browsed Marketplace</p>
                                <p className="text-xs text-slate-500">5 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <FaUser className="text-slate-400" />
                        Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                {user.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <FaUser className="text-slate-400" />
                        Change Password
                    </h2>

                    {message.text && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    className="w-full p-2 border rounded text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    className="w-full p-2 border rounded text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    className="w-full p-2 border rounded text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-bold hover:bg-indigo-700 transition">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
