import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Badge from './models/Badge.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        seedDB();
    })
    .catch(err => console.log(err));

const seedDB = async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Badge.deleteMany({});

    // 1. Create Badges
    const badges = await Badge.insertMany([
        {
            name: 'Early Adopter',
            description: 'Joined in the first month.',
            icon: '🚀',
            criteria: 'Join before Dec 2023'
        },
        {
            name: 'Big Spender',
            description: 'Spent over 1000 Venture Credits.',
            icon: '💸',
            criteria: 'Spend > 1000 VC'
        },
        {
            name: 'Vault Keeper',
            description: 'Found the hidden Vaultie interaction.',
            icon: '🗝️',
            criteria: 'Click Vaultie 5 times'
        }
    ]);

    // 2. Create Products
    await Product.insertMany([
        {
            title: 'Mystery Box',
            description: 'What’s inside? Could be stickers, could be a hoodie!',
            image: '/images/products/Mystery Box.png',
            cost: 500,
            stock: 10,
            category: 'Mystery'
        },
        {
            title: 'E-Cell Hoodie',
            description: 'Premium cotton hoodie with the Founder logo.',
            image: '/images/products/Hoodies.png',
            cost: 2500,
            stock: 5,
            category: 'Apparel'
        },
        {
            title: 'Laptop Sticker Pack',
            description: 'Show off your startup spirit.',
            image: '/images/products/Laptop Sticker Pack.png',
            cost: 100,
            stock: 50,
            category: 'Accessories'
        },
        {
            title: 'Mentorship Session',
            description: '30 mins with a successful alumni founder.',
            image: '/images/products/Mentorship Session.png',
            cost: 5000,
            stock: 2,
            category: 'Experience'
        },
        {
            title: 'Gaming Headset',
            description: 'Noise cancelling for deep coding sessions.',
            image: '/images/products/Gaming Headset.png',
            cost: 3500,
            stock: 3,
            category: 'Tech'
        },
        {
            title: 'Mechanical Keyboard',
            description: 'Clicky keys for maximum productivity.',
            image: '/images/products/Mechanical Keyboard.png',
            cost: 4000,
            stock: 4,
            category: 'Tech'
        },
        {
            title: 'Coffee Mug',
            description: 'Fuel for your late night hacks.',
            image: '/images/products/coffee mugs.png',
            cost: 300,
            stock: 20,
            category: 'Accessories'
        },
        {
            title: 'Ceramic Mug Set',
            description: 'Set of ceramic coffee mugs.',
            image: '/images/products/coffee_mugs.png',
            cost: 550,
            stock: 15,
            category: 'Home'
        },
        {
            title: 'Journal',
            description: 'A stylish journal for your daily notes.',
            image: '/images/products/journal.png',
            cost: 250,
            stock: 50,
            category: 'Stationery'
        },
        {
            title: 'Claw Clips',
            description: 'Durable and stylish hair claw clips.',
            image: '/images/products/claw_clips.png',
            cost: 150,
            stock: 100,
            category: 'Accessories'
        },
        {
            title: 'Planner',
            description: 'Daily planner to keep you organized.',
            image: '/images/products/planner.png',
            cost: 280,
            stock: 40,
            category: 'Stationery'
        },
        {
            title: 'Medicine Organizer',
            description: 'Keep your meds organized.',
            image: '/images/products/medicine_organizer.png',
            cost: 200,
            stock: 60,
            category: 'Health'
        },
        {
            title: 'Hooks',
            description: 'Adhesive wall hooks.',
            image: '/images/products/hooks.png',
            cost: 100,
            stock: 100,
            category: 'Home'
        },
        {
            title: 'Highlighter Set',
            description: 'Colorful highlighters for studying.',
            image: '/images/products/highlighter_set.png',
            cost: 120,
            stock: 80,
            category: 'Stationery'
        }
    ]);

    // 3. Create Admin User
    await User.create({
        name: 'Admin User',
        email: 'admin@university.edu',
        password: 'adminpassword', // Set a default password
        isWhitelisted: true,
        isAdmin: true,
        balance: 99999,
        badges: [badges[0]._id]
    });

    console.log('✅ Database Seeded!');
    process.exit();
};
