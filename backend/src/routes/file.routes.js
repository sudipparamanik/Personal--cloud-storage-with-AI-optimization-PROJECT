const express = require("express");
const router = express.Router();

const { authUser } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.Middleware");
const {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
} = require("../controllers/file.controller");

router.use(authUser);

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.get("/:id/download", downloadFile);
router.delete("/:id", deleteFile);

module.exports = router;
