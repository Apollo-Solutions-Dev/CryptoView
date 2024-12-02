const express = require("express");
const {
  createUser,
  loginUser,
} = require("../controllers/userController.js");

const router = express.Router();

// Login route
router.post("/signin", loginUser);

// Signup route
router.post("/signup", createUser);

module.exports = router;
