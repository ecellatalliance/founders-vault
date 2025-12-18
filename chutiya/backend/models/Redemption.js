const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    costAtRedemption: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Fulfilled', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Redemption', redemptionSchema);
