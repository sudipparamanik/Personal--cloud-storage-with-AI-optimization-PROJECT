const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authUser, logoutUser);
router.get("/me", authUser, getCurrentUser);

module.exports = router;
