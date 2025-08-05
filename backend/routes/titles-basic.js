const express = require('express');
const router = express.Router();

// @route   GET /api/titles
// @desc    Get all titles
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Titles route working!' });
});

// @route   GET /api/titles/:id
// @desc    Get title by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: 'Title by ID route working!', id: req.params.id });
});

module.exports = router; 