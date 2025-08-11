const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const { auth, adminAuth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all authors (public: only active; treat missing isActive as active)
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find({ $or: [ { isActive: { $exists: false } }, { isActive: true } ] }).select('-password');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get all authors including inactive
router.get('/all', adminAuth, async (req, res) => {
  try {
    const authors = await Author.find().select('-password');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk set visibility (admin only)
router.post('/bulk/visibility', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive boolean is required' });
    }
    const result = await Author.updateMany({}, { $set: { isActive } });
    res.json({ message: 'Visibility updated', matched: result.matchedCount || result.n, modified: result.modifiedCount || result.nModified });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single author
router.get('/:id', async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const author = await Author.findById(req.params.id).select('-password');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create author (admin only)
router.post('/', async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author.toPublicJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update author
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    Object.assign(author, req.body);
    await author.save();
    res.json(author.toPublicJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete author (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 