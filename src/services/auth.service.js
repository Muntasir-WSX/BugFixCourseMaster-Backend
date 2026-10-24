const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendWelcomeEmail } = require("./email.service");

const register = async ({ name, email, password, role, adminKey }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const assignedRole = (adminKey && adminKey === process.env.ADMIN_KEY) ? (role || "admin") : "student";

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: assignedRole,
  });

  const token = generateToken({ id: user._id, role: user.role });

  try {
    sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error('Email sending failed (non-critical):', err.message);
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid email or password");

  if (user.isBanned) {
  throw new Error("Your account has been banned by the administrator.");
}

  const token = generateToken({ id: user._id, role: user.role });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) throw new Error("User not found");
  return user;
};

module.exports = { register, login, getMe };