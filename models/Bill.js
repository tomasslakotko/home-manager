const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  apartment: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['water', 'electricity', 'heating', 'gas', 'maintenance', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  paymentDate: Date,
  paymentMethod: String,
  transactionId: String,
  meterReadings: [{
    meterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meter'
    },
    previousReading: Number,
    currentReading: Number,
    consumption: Number,
    rate: Number
  }],
  lateFees: {
    type: Number,
    default: 0
  },
  notes: String,
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Calculate late fees if overdue
billSchema.methods.calculateLateFees = function() {
  if (this.status === 'overdue' && this.dueDate < new Date()) {
    const daysOverdue = Math.floor((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.lateFees = Math.round((this.amount * 0.05) * daysOverdue * 100) / 100; // 5% per day
  }
  return this.lateFees;
};

// Update status based on due date
billSchema.methods.updateStatus = function() {
  if (this.status === 'pending' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  return this.status;
};

// Pre-save middleware
billSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.calculateLateFees();
  this.updateStatus();
  next();
});

// Indexes
billSchema.index({ apartment: 1, status: 1 });
billSchema.index({ dueDate: 1 });
billSchema.index({ 'meterReadings.meterId': 1 });

module.exports = mongoose.model('Bill', billSchema);
