const express = require("express");
const router = express.Router();

const { authUser } = require("../middleware/auth.middleware");
const { smartSearch, chatWithFiles } = require("../controllers/ai.controller");

router.use(authUser);

router.post("/search", smartSearch);
router.post("/chat", chatWithFiles);

module.exports = router;
