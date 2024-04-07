// middleware/authorizeRoles.js
function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" }); // Return Forbidden status if user role is not allowed
    }
    next(); // Pass the request to the next middleware or route handler
  };
}

module.exports = authorizeRoles;
