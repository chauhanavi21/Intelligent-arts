const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth basic route working!' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register route working!' });
});

module.exports = router; 