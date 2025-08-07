const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['featured-author', 'featured-title', 'promotional', 'announcement'],
    default: 'promotional'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  imageFile: {
    type: String, // Store uploaded file path
    default: null
  },
  buttonText: {
    type: String,
    default: 'Learn More'
  },
  buttonLink: {
    type: String,
    required: true
  },
  // For featured author/title banners, link to specific content
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentModel',
    required: function() {
      return ['featured-author', 'featured-title'].includes(this.type);
    }
  },
  contentModel: {
    type: String,
    enum: ['Author', 'Title'],
    required: function() {
      return ['featured-author', 'featured-title'].includes(this.type);
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  settings: {
    showImage: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      enum: ['left', 'right', 'center'],
      default: 'left'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bannerSchema.index({ type: 1, isActive: 1 });
bannerSchema.index({ priority: -1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Banner', bannerSchema); 