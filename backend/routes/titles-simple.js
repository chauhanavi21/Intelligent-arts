const express = require('express');
const Title = require('../models/Title');
const router = express.Router();

// @route   GET /api/titles
// @desc    Get all titles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const titles = await Title.find({ isActive: true })
      .populate('authorId', 'name')
      .sort({ priority: -1, createdAt: -1 });
    
    res.json({ titles, total: titles.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/titles/:id
// @desc    Get title by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const title = await Title.findById(req.params.id).populate('authorId', 'name');
    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json(title);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 