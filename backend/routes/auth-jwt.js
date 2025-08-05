const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth JWT route working!' });
});

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Create a simple JWT token
  const payload = { id: 'test', role: 'author' };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
    if (err) throw err;
    res.json({ token, message: 'Register route working!' });
  });
});

module.exports = router; 