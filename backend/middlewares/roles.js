// backend/middlewares/roles.js
module.exports = function(allowedRoles = []) {
  return function (req, res, next) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'No user' });
    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
};
