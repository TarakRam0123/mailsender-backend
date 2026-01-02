const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: false });
    }

    // Check email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", status: false });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    if (!newUser) {
      return res
        .status(400)
        .json({ message: "Registration failed", status: false });
    }

    return res
      .status(201)
      .json({ message: "Registration success", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All Fields Required", status: false });
    }
    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) {
      return res
        .status(400)
        .json({ message: "Account not Found Please Register", status: false });
    }
    const passwordMatch = await bcrypt.compare(password, isEmailExist.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentails", status: false });
    }

    const token = jwt.sign(
      {
        userid: isEmailExist._id,
        email: isEmailExist.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true, // 🔥 cannot be accessed by JS
      secure: true, // true in production (HTTPS)
      sameSite: "none", // IMPORTANT for OAuth redirect
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "login success", status: true, token });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userDetails = await User.findById(req.userid).select("-password");

    if (!userDetails) {
      return res.status(401).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      status: true,
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const { name, mobile, bio } = req.body;

    if (!name || !mobile || !bio) {
      return res.status(400).json({
        message: "Nothing to update",
        status: false,
      });
    }

    const result = await User.findByIdAndUpdate(
      req.userid,
      {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(bio && { bio }),
      },
      {
        runValidators: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Details updated successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updateUserDetails,
};
