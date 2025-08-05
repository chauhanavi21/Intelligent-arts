const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth validator route working!' });
});

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({ message: 'Register route working!' });
});

module.exports = router; 