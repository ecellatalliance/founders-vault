const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // URL or icon name
    criteria: { type: String }, // Description of how to unlock
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
