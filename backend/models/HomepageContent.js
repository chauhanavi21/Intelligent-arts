const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['featured_authors', 'promotional_banner', 'title_section'],
    default: 'title_section'
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Flexible content structure
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
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  settings: {
    columns: {
      type: Number,
      default: 4,
      min: 1,
      max: 6
    },
    showViewAll: {
      type: Boolean,
      default: true
    },
    maxItems: {
      type: Number,
      default: 8
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
homepageContentSchema.index({ type: 1, isActive: 1, priority: -1 });
homepageContentSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('HomepageContent', homepageContentSchema); 