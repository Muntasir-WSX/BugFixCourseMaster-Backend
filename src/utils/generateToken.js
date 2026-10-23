const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return jwt.sign(payload, secret, { expiresIn: "30d" });
};

module.exports = generateToken;