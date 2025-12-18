const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/founders-vault';

console.log('🕵️ Testing MongoDB Connection...');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ SUCCESS: MongoDB is running and accessible!');
        console.log('   You are good to go.');
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ ERROR: Could not connect to MongoDB.');
        console.log('   Make sure the MongoDB service is running.');
        console.log('   Error details:', err.message);
        process.exit(1);
    });
