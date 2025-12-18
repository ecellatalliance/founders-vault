const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Login with whitelist check (DB based)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, name, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // 1. Find User
        let user = await User.findOne({ email });

        // 2. Check if user exists and is whitelisted
        // If user doesn't exist, they haven't been enrolled by admin yet.
        if (!user || !user.isWhitelisted) {
            return res.status(403).json({ message: 'You are not in the Vault yet. Contact E-Cell.' });
        }

        // 3. Check Password
        if (user.password) {
            console.log(`Checking password for ${email}`);
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(`Password match: ${isMatch}`);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }
        } else {
            console.log(`No password set for ${email}, allowing login`);
        }

        // 3. Update name if it's their first login (optional, or if admin just set email)
        if (name && user.name === 'Founder') {
            user.name = name;
            await user.save();
        }

        res.json({
            success: true,
            message: 'Welcome back, Founder!',
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
