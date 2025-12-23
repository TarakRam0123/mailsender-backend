const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const {
  connectGoogle,
  googleCallback,
  checkGoogleConnection,
  sendGoogleMail,
} = require("../controller/googleController");
const { default: upload } = require("../middleware/uploadMiddleware");

router.get("/auth/google", verifyToken, connectGoogle);
router.get("/auth/google/callback", googleCallback);
router.get("/me/google", verifyToken, checkGoogleConnection);
router.post("/send/google", verifyToken, upload.array("files"), sendGoogleMail);

module.exports = router;
