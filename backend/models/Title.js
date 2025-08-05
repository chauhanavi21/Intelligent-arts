const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'books',
      'digital', 
      'cd',
      'vinyl',
      'articles',
      'papers',
      'magazine',
      'journal',
      'ebook',
      'audiobook',
      'podcast',
      'video',
      'other'
    ],
    default: 'books'
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  publishDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
titleSchema.index({ authorId: 1 });
titleSchema.index({ category: 1 });
titleSchema.index({ isActive: 1 });
titleSchema.index({ isFeatured: 1 });
titleSchema.index({ priority: -1 });
titleSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Title', titleSchema); 