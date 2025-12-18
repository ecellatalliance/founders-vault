const express = require('express');
const router = express.Router();
const User = require('../models/User');
// @route   GET /api/users/:id/history
// @desc    Get user redemption history
// @access  Private
// Note: In a real app, we'd query the Redemption model. 
// For now, we'll just return a placeholder or implement the query if the model is ready.
const Redemption = require('../models/Redemption');

const bcrypt = require('bcryptjs');

router.get('/:id/history', async (req, res) => {
    try {
        const history = await Redemption.find({ user: req.params.id }).populate('product').sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/users/profile/password
// @desc    Change user password
router.put('/profile/password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify current password
        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users/:id/cart
// @desc    Update cart item (Add/Update quantity)
router.post('/:id/cart', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                user.cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
            } else {
                user.cart[itemIndex].quantity = quantity;
            }
        } else if (quantity > 0) {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        const updatedUser = await User.findById(req.params.id).populate('cart.product').populate('wishlist');
        res.json(updatedUser.cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users/:id/wishlist
// @desc    Toggle wishlist item
router.post('/:id/wishlist', async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1); // Remove
        } else {
            user.wishlist.push(productId); // Add
        }

        await user.save();
        const updatedUser = await User.findById(req.params.id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
