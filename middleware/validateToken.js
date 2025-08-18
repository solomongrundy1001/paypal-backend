const jwt = require("jsonwebtoken");
require("dotenv").config();
const AdminModel = require("../models/admin.model");

const validateAdminToken = async (req, res, next) => {
  let bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({ message: "Unauthorized, token is required" });
  }
  const token = bearerToken.split(" ")[1]
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.findOne({
      email: decode.email,
      role: decode.role,
    });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Unauthorized, You don't have access" });
    }

    req.admin = admin;
    next();

  } catch (error) {
    console.log(error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token signature" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
  }
};

module.exports = validateAdminToken;
