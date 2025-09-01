const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        message_lv: 'Nepieciešams piekļuves tokens'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        message_lv: 'Nederīgs vai beidzies termiņa tokens'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        message_lv: 'Nederīgs tokens'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        message_lv: 'Tokens beidzies'
      });
    }
    return res.status(500).json({ 
      message: 'Authentication error',
      message_lv: 'Autentifikācijas kļūda'
    });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        message_lv: 'Nepieciešama autentifikācija'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        message_lv: 'Nepietiek tiesību'
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole(['admin', 'superadmin']);

// Check if user is superadmin
const requireSuperAdmin = requireRole(['superadmin']);

// Check if user can access apartment data
const canAccessApartment = (req, res, next) => {
  const { apartment } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      message_lv: 'Nepieciešama autentifikācija'
    });
  }

  // Admins can access all apartments
  if (['admin', 'superadmin'].includes(req.user.role)) {
    return next();
  }

  // Residents can only access their own apartment
  if (req.user.apartment === apartment) {
    return next();
  }

  return res.status(403).json({ 
    message: 'Access denied to this apartment',
    message_lv: 'Piekļuve šai dzīvoklim liegta'
  });
};

// Check if user can modify data
const canModifyData = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      message_lv: 'Nepieciešama autentifikācija'
    });
  }

  // Only admins can modify data
  if (['admin', 'superadmin'].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ 
    message: 'Modification not allowed',
    message_lv: 'Modifikācija nav atļauta'
  });
};

// Rate limiting for login attempts
const loginAttempts = new Map();

const checkLoginAttempts = (req, res, next) => {
  const { email } = req.body;
  const key = `login_${email}`;
  const attempts = loginAttempts.get(key) || { count: 0, lastAttempt: 0 };
  
  const now = Date.now();
  const timeWindow = 15 * 60 * 1000; // 15 minutes
  
  if (now - attempts.lastAttempt > timeWindow) {
    attempts.count = 0;
  }
  
  if (attempts.count >= 5) {
    return res.status(429).json({ 
      message: 'Too many login attempts. Please try again later.',
      message_lv: 'Pārāk daudz pieteikšanās mēģinājumu. Lūdzu, mēģiniet vēlāk.'
    });
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  loginAttempts.set(key, attempts);
  
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  canAccessApartment,
  canModifyData,
  checkLoginAttempts
};
