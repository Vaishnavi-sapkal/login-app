const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');

// GET /dashboard → serve the dashboard HTML
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

// GET /dashboard/me → return logged-in user info as JSON
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Dashboard /me error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
