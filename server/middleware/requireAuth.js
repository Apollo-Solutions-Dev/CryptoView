const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  console.log("Auth Header:", authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  
  console.log("Token:", token);
  console.log("Secret being used:", process.env.SECRET);

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded token:", decoded);

    const user = await userModel.findOne({ _id: decoded._id });
    console.log("Found user:", user);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      secret: process.env.SECRET
    });
    res.status(401).json({ 
      error: "Request is not authorized", 
      details: error.message,
      tokenReceived: token
    });
  }
};

module.exports = requireAuth;
