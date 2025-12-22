const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  saveDraft,
  getPreviousMails,
  getDraft,
} = require("../controller/mailController");
const router = express.Router();

router.post("/saveDraft", verifyToken, saveDraft);
router.get("/getDraft", verifyToken, getDraft);
router.get("/getprevious", verifyToken, getPreviousMails);

module.exports = router;
