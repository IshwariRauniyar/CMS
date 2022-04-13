const jwt = require("jsonwebtoken");
const config = require("../config");

const { TokenExpiredError } = jwt;

const catchError = (err, req, res, next) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Token expired",
      code: 401,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    code: 500,
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  //   const token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Token not found",
      code: 401,
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, req, res, next);
    }
    // req.decoded = decoded;
    req.userId = decoded.id;
    next();
  });
};

// const verifyRefreshToken = (req, res, next) => {
//   const refreshToken = req.headers["x-refresh-token"];
//   if (!refreshToken) {
//     return catchError(err, req, res, next);
//   }
//   jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
//     if (err) {
//       return catchError(err, req, res, next);
//     }
//     // req.decoded = decoded;
//     req.userId = decoded.id;
//     next();
//   });
// };

const authMiddleware = {
  catchError,
  verifyToken,
  //   verifyRefreshToken,
};

module.exports = authMiddleware;
