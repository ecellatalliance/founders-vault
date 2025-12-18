const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Badge = require('../models/Badge');
const Redemption = require('../models/Redemption');

const bcrypt = require('bcryptjs');

// --- USER MANAGEMENT ---

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/admin/users
// @desc    Enroll (whitelist) a new user
router.post('/users', async (req, res) => {
    const { name, email, balance, isAdmin, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name: name || 'Founder',
            email,
            balance: balance || 0,
            isAdmin: isAdmin || false,
            isWhitelisted: true
        });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/admin/users/:id/balance
// @desc    Update user balance
router.put('/users/:id/balance', async (req, res) => {
    const { amount, type } = req.body; // type: 'set' or 'add'
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (type === 'add') {
            user.balance += Number(amount);
        } else {
            user.balance = Number(amount);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/admin/users/:id/password
// @desc    Update user password
router.put('/users/:id/password', async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
        }

        res.json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/admin/users/bulk-import
// @desc    Bulk import users from CSV data
router.post('/users/bulk-import', async (req, res) => {
    const { users } = req.body; // Expects array of { name, email, password, balance, isAdmin }

    if (!users || !Array.isArray(users)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const results = [];
        for (const u of users) {
            // Check if user exists
            let user = await User.findOne({ email: u.email });
            if (user) {
                results.push({ email: u.email, status: 'Skipped - User already exists' });
                continue;
            }

            // Create new user
            user = new User({
                name: u.name || 'Founder',
                email: u.email,
                balance: u.balance || 0,
                isAdmin: u.isAdmin === 'true' || u.isAdmin === true,
                isWhitelisted: true
            });

            if (u.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(u.password, salt);
            }

            await user.save();
            results.push({ email: u.email, status: 'Success' });
        }
        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- REDEMPTION MANAGEMENT ---

// @route   GET /api/admin/redemptions
// @desc    Get all redemptions
router.get('/redemptions', async (req, res) => {
    try {
        const redemptions = await Redemption.find()
            .populate('user', 'name email')
            .populate('product', 'title')
            .sort({ timestamp: -1 });
        res.json(redemptions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/admin/redemptions/:id
// @desc    Update redemption status
router.put('/redemptions/:id', async (req, res) => {
    try {
        const redemption = await Redemption.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(redemption);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- BADGE MANAGEMENT ---

// @route   POST /api/admin/badges
// @desc    Create a new badge
router.post('/badges', async (req, res) => {
    try {
        const badge = new Badge(req.body);
        await badge.save();
        res.json(badge);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
