/**
 * Middleware: protect routes that require login
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  // API request → JSON error
  if (req.headers['content-type'] === 'application/json') {
    return res.status(401).json({ message: 'Please log in first.' });
  }
  // Browser request → redirect to login
  res.redirect('/');
};

/**
 * Middleware: block already-logged-in users from hitting login/register
 */
const isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = { isAuthenticated, isGuest };
