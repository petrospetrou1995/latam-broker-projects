const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broker',
    required: true
  },
  user: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    country: {
      type: String,
      required: true
    }
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  pros: [String],
  cons: [String],
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  tradingDuration: {
    type: String,
    enum: ['less-than-1-year', '1-3-years', '3-5-years', 'more-than-5-years'],
    default: '1-3-years'
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
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
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update broker rating when review is saved
reviewSchema.post('save', async function() {
  const Broker = mongoose.model('Broker');
  const broker = await Broker.findById(this.broker);
  
  if (broker) {
    const reviews = await mongoose.model('Review').find({ 
      broker: this.broker, 
      isApproved: true 
    });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      broker.rating = totalRating / reviews.length;
      broker.totalReviews = reviews.length;
      await broker.save();
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
