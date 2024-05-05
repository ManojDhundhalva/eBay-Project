const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, resp, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return resp.status(404).json({ message: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return resp.status(403).json({ message: "Token is not valid!" });
    }
    req.user = user;
    next();
  });
};

const verifyTokenAndAuthorizationGeneral = (req, resp, next) => {
  verifyToken(req, resp, () => {
    if (
      String(req.user.username) === String(req.query.username) &&
      String(req.user.role) === String(req.query.role)
    ) {
      next();
    } else {
      resp.status(404).json({ message: "You are not allowed to do that!" });
    }
  });
};

const verifyTokenAndAuthorization = (requiredRole) => (req, resp, next) => {
  verifyToken(req, resp, () => {
    if (
      String(req.user.username) === String(req.query.username) &&
      String(req.user.role) === String(req.query.role) &&
      String(req.query.role) === requiredRole
    ) {
      next();
    } else {
      resp.status(404).json({ message: "You are not allowed to do that!" });
    }
  });
};

const verifyTokenAndAuthorizationUser = verifyTokenAndAuthorization("user");
const verifyTokenAndAuthorizationManager =
  verifyTokenAndAuthorization("manager");
const verifyTokenAndAuthorizationShipper =
  verifyTokenAndAuthorization("shipper");

module.exports = {
  verifyTokenAndAuthorizationUser,
  verifyTokenAndAuthorizationManager,
  verifyTokenAndAuthorizationShipper,
  verifyTokenAndAuthorizationGeneral,
  verifyToken,
};
