const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bill_reminder', 'maintenance', 'announcement', 'event', 'feedback_update', 'parking', 'emergency'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
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
  message: {
    lv: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    channels: [{
      type: String,
      enum: ['email', 'push', 'sms', 'whatsapp']
    }],
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    deliveryStatus: {
      email: {
        sent: Boolean,
        sentAt: Date,
        error: String
      },
      push: {
        sent: Boolean,
        sentAt: Date,
        error: String
      },
      sms: {
        sent: Boolean,
        sentAt: Date,
        error: String
      },
      whatsapp: {
        sent: Boolean,
        sentAt: Date,
        error: String
      }
    }
  }],
  channels: [{
    type: String,
    enum: ['email', 'push', 'sms', 'whatsapp'],
    required: true
  }],
  scheduledFor: Date,
  sentAt: Date,
  expiresAt: Date,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: Number,
    endDate: Date,
    daysOfWeek: [Number],
    dayOfMonth: Number
  },
  template: {
    name: String,
    variables: mongoose.Schema.Types.Mixed
  },
  attachments: [{
    filename: String,
    path: String,
    originalName: String
  }],
  relatedEntity: {
    type: {
      type: String,
      enum: ['bill', 'feedback', 'news', 'calendar', 'parking']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for delivery status
notificationSchema.virtual('deliveryStats').get(function() {
  const stats = {
    total: this.recipients.length,
    delivered: 0,
    failed: 0,
    pending: 0
  };

  this.recipients.forEach(recipient => {
    let hasDelivered = false;
    let hasFailed = false;

    Object.values(recipient.deliveryStatus).forEach(status => {
      if (status.sent) hasDelivered = true;
      if (status.error) hasFailed = true;
    });

    if (hasDelivered) stats.delivered++;
    else if (hasFailed) stats.failed++;
    else stats.pending++;
  });

  return stats;
});

// Check if notification is expired
notificationSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Check if notification should be sent
notificationSchema.methods.shouldSend = function() {
  if (this.isExpired()) return false;
  if (this.scheduledFor && new Date() < this.scheduledFor) return false;
  return true;
};

// Mark as read for specific user
notificationSchema.methods.markAsRead = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient) {
    recipient.isRead = true;
    recipient.readAt = new Date();
  }
};

// Get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    'recipients.user': userId,
    'recipients.isRead': false
  });
};

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ 'recipients.user': 1, 'recipients.isRead': 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ 'relatedEntity.type': 1, 'relatedEntity.id': 1 });

// Ensure virtual fields are serialized
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);
