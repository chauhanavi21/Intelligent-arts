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
  imageFile: {
    type: String, // Store uploaded file path
    default: null
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
  },
  // Purchase links and pricing
  purchaseLinks: [{
    platform: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: String,
      trim: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  showPricing: {
    type: Boolean,
    default: false
  },
  showReviewsSection: {
    type: Boolean,
    default: true
  },
  // Optional Read Sample button
  showSampleButton: {
    type: Boolean,
    default: false
  },
  sampleUrl: {
    type: String,
    trim: true,
    default: ''
  },
  // Additional book details
  isbn: {
    type: String,
    trim: true
  },
  pages: {
    type: Number,
    min: 1
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  // Book metadata
  language: {
    type: String,
    default: 'English'
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook', 'digital', 'other'],
    default: 'hardcover'
  },
  // SEO and display
  metaDescription: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  // Editorial and external reviews
  reviews: [{
    quote: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }]
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