const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cost: { type: Number, required: true }, // Cost in Venture Credits
    stock: { type: Number, default: 0 },
    category: { type: String, default: 'General' },
    isHidden: { type: Boolean, default: false }, // For Easter eggs or limited items
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
