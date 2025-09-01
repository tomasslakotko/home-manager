const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
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
    lv: String,
    en: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['holiday', 'event', 'maintenance', 'meeting', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['latvian_holiday', 'building_event', 'maintenance', 'resident_event', 'admin_event'],
    required: true
  },
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
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    dayOfMonth: Number
  },
  location: String,
  color: {
    type: String,
    default: '#3788d8'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    responseDate: Date
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms']
    },
    time: {
      type: Number, // minutes before event
      default: 15
    }
  }],
  attachments: [{
    filename: String,
    path: String,
    originalName: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Virtual for duration
calendarSchema.virtual('duration').get(function() {
  if (this.allDay) return 'all-day';
  const diff = this.endDate - this.startDate;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
});

// Check if event is happening today
calendarSchema.methods.isToday = function() {
  const today = new Date();
  const start = new Date(this.startDate);
  return start.toDateString() === today.toDateString();
};

// Check if event is upcoming
calendarSchema.methods.isUpcoming = function() {
  return this.startDate > new Date();
};

// Check if event is ongoing
calendarSchema.methods.isOngoing = function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
};

// Pre-save middleware
calendarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
calendarSchema.index({ startDate: 1, endDate: 1 });
calendarSchema.index({ type: 1, category: 1 });
calendarSchema.index({ isPublic: 1, startDate: 1 });
calendarSchema.index({ 'attendees.user': 1 });

// Ensure virtual fields are serialized
calendarSchema.set('toJSON', { virtuals: true });
calendarSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Calendar', calendarSchema);
