const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { saveDraft, getPreviousMails } = require("../controller/mailController");
const router = express.Router();

router.post("/saveDraft", verifyToken, saveDraft);
router.get("/getprevious", verifyToken, getPreviousMails);

module.exports = router;
