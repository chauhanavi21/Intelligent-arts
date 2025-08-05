const express = require('express');
const router = express.Router();

// @route   GET /api/authors
// @desc    Get all authors
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Authors route working!' });
});

// @route   GET /api/authors/:id
// @desc    Get author by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: 'Author by ID route working!', id: req.params.id });
});

module.exports = router; 