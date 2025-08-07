const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { adminAuth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Upload single image
router.post('/image', adminAuth, (req, res) => {
  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({ 
        message: err.message || 'File upload failed' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded' 
      });
    }

    // Return the file path that can be used in the frontend
    const filePath = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: filePath,
      size: req.file.size
    });
  });
});

// Upload multiple images
router.post('/images', adminAuth, (req, res) => {
  uploadMultiple(req, res, function (err) {
    if (err) {
      return res.status(400).json({ 
        message: err.message || 'File upload failed' 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        message: 'No files uploaded' 
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  });
});

// Delete uploaded file
router.delete('/image/:filename', adminAuth, (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ 
      message: 'File not found' 
    });
  }

  // Delete file
  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Error deleting file' 
      });
    }
    res.json({ 
      message: 'File deleted successfully' 
    });
  });
});

// Get list of uploaded files (for admin)
router.get('/files', adminAuth, (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Error reading uploads directory' 
      });
    }

    const fileList = files.map(filename => ({
      filename,
      path: `/uploads/${filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/${filename}`
    }));

    res.json({
      files: fileList
    });
  });
});

module.exports = router; 