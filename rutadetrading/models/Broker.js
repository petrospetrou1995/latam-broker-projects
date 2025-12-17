const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  features: [{
    name: String,
    description: String,
    icon: String
  }],
  tradingPlatforms: [{
    name: String,
    description: String,
    supported: Boolean
  }],
  accountTypes: [{
    name: String,
    minDeposit: Number,
    currency: String,
    description: String
  }],
  regulations: [{
    country: String,
    regulator: String,
    license: String
  }],
  pros: [String],
  cons: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['forex', 'stocks', 'crypto', 'cfd', 'commodities'],
    default: 'forex'
  },
  countries: [String], // Latin American countries where broker operates
  languages: [String], // Supported languages
  customerSupport: {
    email: String,
    phone: String,
    liveChat: Boolean,
    languages: [String]
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
brokerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from name
brokerSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Broker', brokerSchema);
