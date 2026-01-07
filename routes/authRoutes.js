const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updateUserDetails,
  changePassword,
} = require("../controller/authController");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getUser", verifyToken, getUserDetails);
router.post("/updateUser", verifyToken, updateUserDetails);
router.put("/changePassword", verifyToken, changePassword);
module.exports = router;
