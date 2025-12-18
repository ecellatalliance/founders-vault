const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password for login
    avatar: { type: String, default: '' },
    balance: { type: Number, default: 0 }, // Venture Credits
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    isAdmin: { type: Boolean, default: false },
    isWhitelisted: { type: Boolean, default: false }, // Access control
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
