const express = require('express');
const Author = require('../models/Author');
const router = express.Router();

// @route   GET /api/authors
// @desc    Get all authors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find({}, '-password').sort({ priority: -1, name: 1 });
    res.json(authors);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/authors/:id
// @desc    Get author by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id, '-password');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 