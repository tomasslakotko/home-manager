const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  spaceNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['resident', 'guest', 'disabled', 'electric'],
    default: 'resident'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  size: {
    type: String,
    enum: ['standard', 'large', 'compact'],
    default: 'standard'
  },
  location: {
    floor: String,
    section: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentVehicle: {
    plateNumber: String,
    model: String,
    color: String,
    parkedAt: Date
  },
  accessPass: {
    passNumber: String,
    qrCode: String,
    isActive: {
      type: Boolean,
      default: true
    },
    issuedAt: Date,
    expiresAt: Date
  },
  restrictions: [String],
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

const parkingPassSchema = new mongoose.Schema({
  passNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['resident', 'guest', 'temporary', 'service'],
    required: true
  },
  holder: {
    name: String,
    phone: String,
    email: String
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace'
  },
  qrCode: String,
  barcode: String,
  isActive: {
    type: Boolean,
    default: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageHistory: [{
    entryTime: Date,
    exitTime: Date,
    vehiclePlate: String
  }],
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

// Generate unique pass number
parkingPassSchema.pre('save', function(next) {
  if (!this.passNumber) {
    this.passNumber = 'PASS' + Date.now().toString().slice(-8);
  }
  this.updatedAt = Date.now();
  next();
});

// Generate QR code for parking space
parkingSpaceSchema.pre('save', function(next) {
  if (!this.accessPass.qrCode) {
    this.accessPass.qrCode = `PARK_${this.spaceNumber}_${Date.now()}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Check if parking space is available
parkingSpaceSchema.methods.isAvailable = function() {
  return this.status === 'available' && !this.assignedTo;
};

// Check if pass is expired
parkingPassSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Check if pass is valid
parkingPassSchema.methods.isValid = function() {
  return this.isActive && !this.isExpired();
};

// Indexes
parkingSpaceSchema.index({ spaceNumber: 1 });
parkingSpaceSchema.index({ status: 1, type: 1 });
parkingSpaceSchema.index({ assignedTo: 1 });
parkingSpaceSchema.index({ 'accessPass.passNumber': 1 });

parkingPassSchema.index({ passNumber: 1 });
parkingPassSchema.index({ type: 1, isActive: 1 });
parkingPassSchema.index({ assignedUser: 1 });
parkingPassSchema.index({ expiresAt: 1 });

module.exports = {
  ParkingSpace: mongoose.model('ParkingSpace', parkingSpaceSchema),
  ParkingPass: mongoose.model('ParkingPass', parkingPassSchema)
};
