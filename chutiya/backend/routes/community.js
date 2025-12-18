const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// @route   GET /api/community/announcements
// @desc    Get all announcements
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/community/announcements
// @desc    Create an announcement (Admin only - simplified for now)
router.post('/announcements', async (req, res) => {
    const { title, content, type } = req.body;
    try {
        const newAnnouncement = new Announcement({
            title,
            content,
            type
        });
        const savedAnnouncement = await newAnnouncement.save();
        res.json(savedAnnouncement);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/community/announcements/:id
// @desc    Delete an announcement
router.delete('/announcements/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
