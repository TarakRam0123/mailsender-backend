const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
} = require("../controller/authController");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getUser", verifyToken, getUserDetails);
module.exports = router;
