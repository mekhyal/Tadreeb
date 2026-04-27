const jwt = require('jsonwebtoken');

/** Sets `req.user` when a valid Bearer token is sent; never sends 401 (for public GET routes). */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) return next();
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // ignore invalid/expired token for optional reads
  }
  next();
}

module.exports = optionalAuth;
