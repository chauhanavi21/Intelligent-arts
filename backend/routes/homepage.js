const express = require('express');
const HomepageContent = require('../models/HomepageContent');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/homepage
// @desc    Get all homepage content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const content = await HomepageContent.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 });
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/homepage/:type
// @desc    Get homepage content by type
// @access  Public
router.get('/:type', async (req, res) => {
  try {
    const content = await HomepageContent.find({ 
      type: req.params.type, 
      isActive: true 
    }).sort({ priority: -1 });
    
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/homepage
// @desc    Create homepage content
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const content = new HomepageContent(req.body);
    await content.save();
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/homepage/:id
// @desc    Update homepage content
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const content = await HomepageContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/homepage/:id
// @desc    Delete homepage content
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const content = await HomepageContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await HomepageContent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 