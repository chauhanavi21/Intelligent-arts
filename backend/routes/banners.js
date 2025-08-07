const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { adminAuth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all active banners
router.get('/', async (req, res) => {
  try {
    const { type, limit = 5 } = req.query;
    
    const filter = { isActive: true };
    if (type) filter.type = type;
    
    // Check if banner is within date range
    const now = new Date();
    filter.$or = [
      { endDate: { $exists: false } },
      { endDate: { $gt: now } }
    ];
    filter.startDate = { $lte: now };

    const banners = await Banner.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create banner (admin only)
router.post('/', async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update banner (admin only)
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete banner (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 