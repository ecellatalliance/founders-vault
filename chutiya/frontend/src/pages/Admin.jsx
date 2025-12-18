import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit2, X } from 'lucide-react';

const Admin = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);

    // Forms State
    const [newProduct, setNewProduct] = useState({ title: '', description: '', image: '', cost: 0, stock: 0, category: 'General' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', balance: 0 });
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'news' });
    const [bulkFile, setBulkFile] = useState(null);

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'redemptions') fetchRedemptions();
        if (activeTab === 'community') fetchAnnouncements();
    }, [activeTab]);

    // --- FETCHERS ---
    const fetchProducts = async () => {
        const res = await fetch('http://localhost:5000/api/shop/products');
        setProducts(await res.json());
    };
    const fetchUsers = async () => {
        const res = await fetch('http://localhost:5000/api/admin/users');
        setUsers(await res.json());
    };
    const fetchRedemptions = async () => {
        const res = await fetch('http://localhost:5000/api/admin/redemptions');
        setRedemptions(await res.json());
    };
    const fetchAnnouncements = async () => {
        const res = await fetch('http://localhost:5000/api/community/announcements');
        setAnnouncements(await res.json());
    };

    // --- HANDLERS ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (editingProduct) {
            await handleUpdateProduct();
            return;
        }
        await fetch('http://localhost:5000/api/shop/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        alert('Product Added!');
        setNewProduct({ title: '', description: '', image: '', cost: 0, stock: 0, category: 'General' });
        fetchProducts();
    };

    const handleUpdateProduct = async () => {
        await fetch(`http://localhost:5000/api/shop/products/${editingProduct._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        alert('Product Updated!');
        setEditingProduct(null);
        setNewProduct({ title: '', description: '', image: '', cost: 0, stock: 0, category: 'General' });
        fetchProducts();
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setNewProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setNewProduct({ title: '', description: '', image: '', cost: 0, stock: 0, category: 'General' });
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await fetch(`http://localhost:5000/api/shop/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        if (res.ok) {
            alert('User Enrolled!');
            setNewUser({ name: '', email: '', balance: 0 });
            fetchUsers();
        } else {
            alert('Failed to enroll user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    const handleUpdateBalance = async (userId) => {
        const newAmount = prompt("Enter amount to ADD (use negative to subtract):", "0");
        if (!newAmount) return;

        await fetch(`http://localhost:5000/api/admin/users/${userId}/balance`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newAmount, type: 'add' })
        });

        if (user._id === userId) refreshUser();
        fetchUsers();
    };

    const handleStatusChange = async (id, status) => {
        await fetch(`http://localhost:5000/api/admin/redemptions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchRedemptions();
    };

    const handleBulkUpload = async () => {
        if (!bulkFile) return alert("Select a CSV file first");

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n');
            const users = lines.slice(1).map(line => { // Skip header
                // Format: name,email,password,balance,isAdmin
                const [name, email, password, balance, isAdmin] = line.split(',');
                if (email && email.trim()) {
                    return {
                        name: name?.trim(),
                        email: email?.trim(),
                        password: password?.trim(),
                        balance: balance ? Number(balance.trim()) : 0,
                        isAdmin: isAdmin?.trim().toLowerCase() === 'true'
                    };
                }
                return null;
            }).filter(Boolean);

            if (users.length === 0) return alert("No valid data found");

            try {
                const res = await fetch('http://localhost:5000/api/admin/users/bulk-import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ users })
                });
                const data = await res.json();

                const successCount = data.results.filter(r => r.status === 'Success').length;
                const skippedCount = data.results.filter(r => r.status !== 'Success').length;

                alert(`Processed ${users.length} rows.\n✅ Added: ${successCount}\n⚠️ Skipped: ${skippedCount}\nCheck console for details.`);
                console.table(data.results);
                fetchUsers();
            } catch (err) {
                console.error(err);
                alert('Failed to upload CSV');
            }
        };
        reader.readAsText(bulkFile);
    };

    const downloadTemplate = () => {
        const headers = "name,email,password,balance,isAdmin\n";
        const sample = "John Doe,john@example.com,password123,100,false";
        const blob = new Blob([headers + sample], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "users_template.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/community/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnnouncement)
            });

            if (res.ok) {
                alert('Announcement Posted Successfully! 🎉');
                setNewAnnouncement({ title: '', content: '', type: 'news' });
                fetchAnnouncements();
            } else {
                alert('Failed to post announcement');
            }
        } catch (err) {
            console.error(err);
            alert('Error posting announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!confirm("Delete this announcement?")) return;
        await fetch(`http://localhost:5000/api/community/announcements/${id}`, { method: 'DELETE' });
        fetchAnnouncements();
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admin Command Center 🛠️</h1>
                <p className="text-slate-500">Manage the Vault's inventory and members.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-1">
                {['products', 'users', 'redemptions', 'community'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-slate-500 hover:text-black'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">

                {/* --- PRODUCTS TAB --- */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            {editingProduct && (
                                <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:underline flex items-center gap-1">
                                    <X size={14} /> Cancel Edit
                                </button>
                            )}
                        </div>

                        {/* Low Stock Alert */}
                        {products.some(p => p.stock < 5) && (
                            <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                                <div className="p-2 bg-red-100 rounded-full text-red-600">
                                    <span className="text-xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-800">Low Stock Alert</h3>
                                    <p className="text-sm text-red-600 mb-2">The following items are running low:</p>
                                    <ul className="list-disc list-inside text-sm text-red-700">
                                        {products.filter(p => p.stock < 5).map(p => (
                                            <li key={p._id}>{p.title} (Only {p.stock} left)</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleAddProduct} className={`p-4 rounded-lg border mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 transition-colors ${editingProduct ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-200'}`}>
                            <input type="text" placeholder="Title" className="p-2 border rounded" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} required />
                            <input type="text" placeholder="Image URL" className="p-2 border rounded" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} required />
                            <input type="text" placeholder="Description" className="p-2 border rounded md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required />
                            <input type="number" placeholder="Cost (VC)" className="p-2 border rounded" value={newProduct.cost} onChange={e => setNewProduct({ ...newProduct, cost: Number(e.target.value) })} required />
                            <input type="number" placeholder="Stock" className="p-2 border rounded" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} required />
                            <select
                                className="p-2 border rounded md:col-span-2"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Tech">Tech</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            <button type="submit" className={`font-bold py-2 rounded md:col-span-2 text-white transition-colors ${editingProduct ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-black hover:bg-slate-800'}`}>
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>

                        <h3 className="font-bold text-lg mb-4">Inventory List</h3>
                        <div className="space-y-2">
                            {products.map(p => (
                                <div key={p._id} className="flex items-center justify-between p-3 border border-slate-100 rounded bg-white hover:bg-slate-50 group">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} alt={p.title} className="w-10 h-10 object-contain" />
                                        <div>
                                            <div className="font-bold text-sm">{p.title}</div>
                                            <div className="text-xs text-slate-500">{p.stock} in stock • {p.cost} VC</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(p)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- USERS TAB --- */}
                {activeTab === 'users' && (
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="font-bold text-lg">Member Management</h2>
                                <p className="text-xs text-slate-400">Enroll students or update balances.</p>
                            </div>

                            {/* Bulk Upload */}
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                                    <button onClick={downloadTemplate} className="text-xs text-blue-600 hover:underline font-medium mr-2">Download Template</button>
                                    <input type="file" accept=".csv" onChange={e => setBulkFile(e.target.files[0])} className="text-xs" />
                                    <button onClick={handleBulkUpload} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition-colors">Upload CSV</button>
                                </div>
                                <p className="text-[10px] text-slate-400">Format: name,email,password,balance,isAdmin</p>
                            </div>
                        </div>

                        {/* Add User Form */}
                        <form onSubmit={handleAddUser} className="flex gap-2 mb-6">
                            <input type="text" placeholder="Name" className="p-2 border rounded flex-1" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                            <input type="email" placeholder="Email" className="p-2 border rounded flex-1" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                            <input type="password" placeholder="Password" className="p-2 border rounded flex-1" value={newUser.password || ''} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                            <input type="number" placeholder="Initial Balance" className="p-2 border rounded w-32" value={newUser.balance} onChange={e => setNewUser({ ...newUser, balance: Number(e.target.value) })} />
                            <button type="submit" className="bg-black text-white px-4 rounded font-bold">Enroll</button>
                        </form>

                        {/* User List */}
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Balance</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-slate-100 group hover:bg-slate-50">
                                        <td className="p-3 font-medium">{u.name} {u.isAdmin && '👑'}</td>
                                        <td className="p-3 text-slate-500">{u.email}</td>
                                        <td className="p-3 font-bold text-yellow-600">🪙 {u.balance}</td>
                                        <td className="p-3 flex items-center gap-3">
                                            <button onClick={() => handleUpdateBalance(u._id)} className="text-blue-600 hover:underline text-xs font-bold">Manage Coins</button>
                                            {!u.isAdmin && (
                                                <button onClick={() => handleDeleteUser(u._id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- REDEMPTIONS TAB --- */}
                {activeTab === 'redemptions' && (
                    <div>
                        <h2 className="font-bold text-lg mb-4">Redemption Queue</h2>
                        <div className="space-y-3">
                            {redemptions.map(r => (
                                <div key={r._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div>
                                        <div className="font-bold">{r.product?.title || 'Unknown Item'}</div>
                                        <div className="text-sm text-slate-500">
                                            Requested by <span className="font-medium text-black">{r.user?.name}</span> ({r.user?.email})
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{new Date(r.timestamp).toLocaleString()}</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                                            r.status === 'Fulfilled' ? 'bg-green-200 text-green-800' :
                                                'bg-red-200 text-red-800'
                                            }`}>
                                            {r.status}
                                        </span>

                                        {r.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusChange(r._id, 'Fulfilled')} className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600">Approve</button>
                                                <button onClick={() => handleStatusChange(r._id, 'Cancelled')} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600">Reject</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {redemptions.length === 0 && <p className="text-slate-400 text-center py-8">No redemptions found.</p>}
                        </div>
                    </div>
                )}

                {/* --- COMMUNITY TAB --- */}
                {activeTab === 'community' && (
                    <div>
                        <h2 className="font-bold text-lg mb-4">Community Announcements</h2>
                        <p className="text-sm text-slate-500 mb-6">Post updates, news, and events to the community board.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Post Form */}
                            <div className="lg:col-span-1">
                                <form onSubmit={handlePostAnnouncement} className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-4">
                                    <h3 className="font-bold mb-4">New Post</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Hackathon Winners Announced! 🏆"
                                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                                value={newAnnouncement.title}
                                                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                                            <div className="flex gap-4">
                                                {['news', 'event', 'alert'].map(type => (
                                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type}
                                                            checked={newAnnouncement.type === type}
                                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                                            className="accent-black"
                                                        />
                                                        <span className="capitalize text-sm font-medium text-slate-600">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
                                            <textarea
                                                placeholder="Write your announcement here..."
                                                rows="5"
                                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                                value={newAnnouncement.content}
                                                onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Posting...' : 'Post Announcement 🚀'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Announcement List */}
                            <div className="lg:col-span-2">
                                <h3 className="font-bold mb-4">Recent Posts</h3>
                                <div className="space-y-4">
                                    {announcements.length === 0 ? (
                                        <p className="text-slate-400 italic">No announcements yet.</p>
                                    ) : (
                                        announcements.map(post => (
                                            <div key={post._id} className="p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow relative group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2
                                                            ${post.type === 'alert' ? 'bg-red-100 text-red-600' :
                                                                post.type === 'event' ? 'bg-purple-100 text-purple-600' :
                                                                    'bg-blue-100 text-blue-600'}`}>
                                                            {post.type}
                                                        </span>
                                                        <h4 className="font-bold text-lg">{post.title}</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAnnouncement(post._id)}
                                                        className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <p className="text-slate-600 text-sm line-clamp-3">{post.content}</p>
                                                <div className="mt-3 text-xs text-slate-400">
                                                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Admin;
