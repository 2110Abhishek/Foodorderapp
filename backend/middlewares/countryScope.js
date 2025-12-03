// backend/middlewares/countryScope.js
// This middleware expects req.resourceCountryId to be set by the controller/service
module.exports = function (req, res, next) {
  const user = req.user;
  // Admin global allowed (countryId null)
  if (!user) return res.status(401).json({ message: 'No user' });
  if (!user.countryId) return next(); // global user allowed
  const resourceCountryId = req.resourceCountryId;
  if (!resourceCountryId) return next(); // nothing to check
  if (resourceCountryId.toString() === user.countryId.toString()) return next();
  return res.status(403).json({ message: 'Forbidden: resource not in your country' });
};
