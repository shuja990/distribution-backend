// Middleware to verify JWT and check for required roles
const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    // Get token from Authorization header
    if (!req.user) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // Check if user has one of the required roles
      const hasRequiredRole = requiredRoles.some(role => req.user.role.includes(role));
      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = roleMiddleware;
