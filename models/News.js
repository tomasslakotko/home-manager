const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    lv: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  content: {
    lv: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['general', 'maintenance', 'announcement', 'event', 'emergency'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  attachments: [{
    filename: String,
    path: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isImportant: {
    type: Boolean,
    default: false
  },
  requiresConfirmation: {
    type: Boolean,
    default: false
  },
  confirmedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for view count
newsSchema.virtual('viewCount').get(function() {
  return this.views.length;
});

// Virtual for confirmation count
newsSchema.virtual('confirmationCount').get(function() {
  return this.confirmedBy.length;
});

// Check if news is expired
newsSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

// Check if user has viewed
newsSchema.methods.hasUserViewed = function(userId) {
  return this.views.some(view => view.user.toString() === userId.toString());
};

// Check if user has confirmed
newsSchema.methods.hasUserConfirmed = function(userId) {
  return this.confirmedBy.some(conf => conf.user.toString() === userId.toString());
};

// Pre-save middleware
newsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
newsSchema.index({ category: 1, isPublished: 1 });
newsSchema.index({ publishDate: -1 });
newsSchema.index({ priority: 1, isPublished: 1 });
newsSchema.index({ tags: 1 });

// Ensure virtual fields are serialized
newsSchema.set('toJSON', { virtuals: true });
newsSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('News', newsSchema);
