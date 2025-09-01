const mongoose = require('mongoose');

const meterSchema = new mongoose.Schema({
  apartment: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['water', 'electricity', 'heating', 'gas'],
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  readings: [{
    value: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  lastReading: {
    value: Number,
    date: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastReading when new reading is added
meterSchema.pre('save', function(next) {
  if (this.readings.length > 0) {
    const latestReading = this.readings[this.readings.length - 1];
    this.lastReading = {
      value: latestReading.value,
      date: latestReading.date
    };
  }
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
meterSchema.index({ apartment: 1, type: 1 });
meterSchema.index({ 'readings.date': -1 });

module.exports = mongoose.model('Meter', meterSchema);
