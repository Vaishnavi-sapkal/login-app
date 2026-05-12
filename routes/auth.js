const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ── POST /auth/register ──────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, username, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this username already exists." });
    }

    // Create and save user (password hashed by pre-save hook)
    const user = new User({ name, username, password });
    await user.save();

    console.log(`✅  New user registered: ${user.username} (ID: ${user._id})`);

    // Auto-login after register
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.status(201).json({
      message: "Account created successfully!",
      user: { id: user._id, name: user.name, username: user.username },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "username already registered." });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /auth/login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required." });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Save session
    req.session.userId = user._id;
    req.session.userName = user.name;

    console.log(`🔑  User logged in: ${user.username}`);

    res.json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /auth/logout ────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed." });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully." });
  });
});

module.exports = router;
