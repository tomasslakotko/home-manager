const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, checkLoginAttempts, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  checkLoginAttempts,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        message_lv: 'Validācijas kļūda',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        message_lv: 'Nederīgi dati'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        message_lv: 'Nederīgi dati'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      apartment: user.apartment,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      language: user.language,
      parkingSpaces: user.parkingSpaces,
      contacts: user.contacts
    };

    res.json({
      message: 'Login successful',
      message_lv: 'Pieteikšanās veiksmīga',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      message_lv: 'Servera kļūda'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (admin only)
// @access  Private (Admin)
router.post('/register', [
  authenticateToken,
  requireAdmin,
  body('apartment').notEmpty().trim(),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty().trim(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['resident', 'admin']),
  body('language').isIn(['lv', 'en'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        message_lv: 'Validācijas kļūda',
        errors: errors.array() 
      });
    }

    const {
      apartment,
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      language
    } = req.body;

    // Check if apartment already exists
    const existingApartment = await User.findOne({ apartment });
    if (existingApartment) {
      return res.status(400).json({ 
        message: 'Apartment already registered',
        message_lv: 'Dzīvoklis jau ir reģistrēts'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'Email already registered',
        message_lv: 'E-pasts jau ir reģistrēts'
      });
    }

    // Create new user
    const user = new User({
      apartment,
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      language
    });

    await user.save();

    // Generate token for new user
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      message_lv: 'Lietotājs veiksmīgi reģistrēts',
      token,
      user: {
        id: user._id,
        apartment: user.apartment,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error',
      message_lv: 'Servera kļūda'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');

    res.json({
      message: 'User data retrieved',
      message_lv: 'Lietotāja dati iegūti',
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error',
      message_lv: 'Servera kļūda'
    });
  }
});

// @route   PUT /api/auth/me
// @desc    Update current user profile
// @access  Private
router.put('/me', [
  authenticateToken,
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phone').optional().trim(),
  body('language').optional().isIn(['lv', 'en'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        message_lv: 'Validācijas kļūda',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, phone, language } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (language) updateData.language = language;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      message_lv: 'Profils veiksmīgi atjaunināts',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error',
      message_lv: 'Servera kļūda'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        message_lv: 'Validācijas kļūda',
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Current password is incorrect',
        message_lv: 'Pašreizējā parole nav pareiza'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully',
      message_lv: 'Parole veiksmīgi nomainīta'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Server error',
      message_lv: 'Servera kļūda'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful',
    message_lv: 'Izrakstīšanās veiksmīga'
  });
});

module.exports = router;
