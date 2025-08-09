const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Author = require('../models/Author');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Registration is disabled
router.post('/register', (req, res) => {
  return res.status(403).json({ message: 'Registration is disabled' });
});

// @route   POST /api/auth/login
// @desc    Login author
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if author exists
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      id: author._id,
      role: author.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          author: author.toPublicJSON()
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get author profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ author: req.author });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update author profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').notEmpty().withMessage('Name is required'),
  body('intro').notEmpty().withMessage('Intro is required'),
  body('bio').notEmpty().withMessage('Bio is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, intro, bio, specialties } = req.body;

    // Update author profile
    const author = await Author.findByIdAndUpdate(
      req.author._id,
      {
        name,
        intro,
        bio,
        specialties: specialties || []
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      author: author.toPublicJSON()
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get the full author document with password
    const author = await Author.findById(req.author._id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Verify current password
    const isMatch = await author.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    author.password = newPassword;
    await author.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 