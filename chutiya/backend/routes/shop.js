const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Redemption = require('../models/Redemption');

// @route   GET /api/shop/products
// @desc    Get all products
// @access  Public
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({ isHidden: false }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/shop/products
// @desc    Add a product (Admin only)
// @access  Private
router.post('/products', async (req, res) => {
    const { title, description, image, cost, stock, category } = req.body;

    try {
        const newProduct = new Product({
            title,
            description,
            image,
            cost,
            stock,
            category
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/shop/redeem
// @desc    Redeem a product
// @access  Private
router.post('/redeem', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: 'User or Product not found' });
        }

        // 1. Check Stock
        if (product.stock <= 0) {
            return res.status(400).json({ message: 'Out of stock!' });
        }

        // 2. Check Balance
        if (user.balance < product.cost) {
            return res.status(400).json({ message: 'Insufficient Venture Credits!' });
        }

        // 3. Deduct Credits & Stock
        user.balance -= product.cost;
        product.stock -= 1;

        await user.save();
        await product.save();

        // 4. Log Redemption
        const redemption = new Redemption({
            user: userId,
            product: productId,
            costAtRedemption: product.cost,
            status: 'Pending'
        });

        await redemption.save();

        res.json({
            success: true,
            message: 'Redemption Successful! 🎉',
            newBalance: user.balance,
            redemption
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/shop/products/:id
// @desc    Update a product
router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/shop/products/:id
// @desc    Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
