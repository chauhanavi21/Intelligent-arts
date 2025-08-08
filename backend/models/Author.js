const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  image: {
    type: String,
    default: '/default-author.webp'
  },
  imageFile: {
    type: String, // Store uploaded file path
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  intro: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  sections: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  role: {
    type: String,
    enum: ['author', 'admin'],
    default: 'author'
  }
}, {
  timestamps: true
});

// Hash password before saving
authorSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
authorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
authorSchema.methods.toPublicJSON = function() {
  const author = this.toObject();
  delete author.password;
  return author;
};

module.exports = mongoose.model('Author', authorSchema); 