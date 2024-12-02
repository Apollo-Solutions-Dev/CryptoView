const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// signup user
const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.create({ email, password });
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw Error("User not found");
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      throw Error("Invalid password");
    }

    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser, loginUser };
