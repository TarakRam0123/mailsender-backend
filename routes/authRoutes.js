const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updateUserDetails,
} = require("../controller/authController");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getUser", verifyToken, getUserDetails);
router.post("/updateUser", verifyToken, updateUserDetails);
module.exports = router;
