const multer = require("multer");

// Store file in memory so we can stream the buffer straight to S3
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Allow all types for now — restrict here if you want to whitelist mimetypes
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit, adjust as needed
    },
});

module.exports = upload;
