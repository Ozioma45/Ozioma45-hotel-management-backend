// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized if token is not provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Attach the user object to the request for further use
    next(); // Pass the request to the next middleware or route handler
  });
}

module.exports = authenticateToken;
