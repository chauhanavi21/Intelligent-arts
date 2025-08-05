const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Author = require('../models/Author');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth middleware route working!' });
});

router.get('/profile', auth, (req, res) => {
  res.json({ message: 'Profile route working!', author: req.author });
});

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Test creating an author
    const author = new Author({
      name: req.body.name,
      email: req.body.email,
      password: 'test123',
      intro: 'Test intro',
      bio: 'Test bio'
    });
    
    await author.save();
    
    // Create JWT token
    const payload = { id: author._id, role: author.role };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, author: author.toPublicJSON() });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 