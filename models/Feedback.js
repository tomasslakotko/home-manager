const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['suggestion', 'complaint', 'question', 'maintenance_request', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['building', 'parking', 'utilities', 'security', 'noise', 'cleanliness', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'open'
  },
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
  description: {
    lv: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apartment: {
    type: String,
    required: true
  },
  location: String,
  attachments: [{
    filename: String,
    path: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  estimatedResolutionDate: Date,
  actualResolutionDate: Date,
  resolution: {
    lv: String,
    en: String
  },
  resolutionNotes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  ratingComment: String,
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  downvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      lv: String,
      en: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms']
    },
    sentAt: Date,
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

// Virtual for vote count
feedbackSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

feedbackSchema.virtual('downvoteCount').get(function() {
  return this.downvotes.length;
});

feedbackSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Check if user has voted
feedbackSchema.methods.hasUserVoted = function(userId, voteType) {
  if (voteType === 'upvote') {
    return this.upvotes.some(vote => vote.user.toString() === userId.toString());
  } else if (voteType === 'downvote') {
    return this.downvotes.some(vote => vote.user.toString() === userId.toString());
  }
  return false;
};

// Check if feedback is overdue
feedbackSchema.methods.isOverdue = function() {
  if (this.estimatedResolutionDate && this.status !== 'resolved' && this.status !== 'closed') {
    return new Date() > this.estimatedResolutionDate;
  }
  return false;
};

// Calculate response time
feedbackSchema.methods.getResponseTime = function() {
  if (this.assignedAt && this.submittedBy) {
    return this.assignedAt - this.createdAt;
  }
  return null;
};

// Pre-save middleware
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ category: 1, priority: 1 });
feedbackSchema.index({ submittedBy: 1, createdAt: -1 });
feedbackSchema.index({ assignedTo: 1, status: 1 });
feedbackSchema.index({ 'upvotes.user': 1 });
feedbackSchema.index({ 'downvotes.user': 1 });

// Ensure virtual fields are serialized
feedbackSchema.set('toJSON', { virtuals: true });
feedbackSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
