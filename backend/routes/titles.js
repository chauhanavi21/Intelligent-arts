const express = require('express');
const router = express.Router();
const Title = require('../models/Title');
const { adminAuth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all titles with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, authorId, category, isActive, isFeatured } = req.query;
    
    const filter = {};
    if (authorId) filter.authorId = authorId;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    const titles = await Title.find(filter)
      .populate('authorId', 'name')
      .sort({ priority: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Title.countDocuments(filter);

    res.json({
      titles,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single title
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid title ID format' });
    }

    const title = await Title.findById(req.params.id).populate('authorId', 'name');
    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json(title);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create title (admin only)
router.post('/', async (req, res) => {
  try {
    const title = new Title(req.body);
    await title.save();
    res.status(201).json(title);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update title (admin only)
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid title ID format' });
    }

    const title = await Title.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('authorId', 'name');

    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json(title);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete title (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid title ID format' });
    }

    const title = await Title.findByIdAndDelete(req.params.id);
    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json({ message: 'Title deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 