const {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../db/S3clint");
const File = require("../models/File");
const { extractText } = require("../services/textExtractor");

const MAX_STORED_CONTENT_CHARS = 20000;

// Upload a file
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }

    const s3Key = `${req.user._id}-${Date.now()}-${req.file.originalname}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        })
    );

    // Best-effort text extraction so the file is searchable/askable by AI later.
    // Failures here should never block the upload itself.
    const extracted = await extractText(req.file.buffer, req.file.mimetype);

    const file = await File.create({
        owner: req.user._id,
        originalName: req.file.originalname,
        s3Key,
        mimeType: req.file.mimetype,
        size: req.file.size,
        content: extracted.slice(0, MAX_STORED_CONTENT_CHARS),
    });

    res.status(201).json(file);
};

// List all files for logged-in user
const listFiles = async (req, res) => {
    const files = await File.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(files);
};

// Get a download URL for a file
const downloadFile = async (req, res) => {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.s3Key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.status(200).json({ url });
};

// Delete a file
const deleteFile = async (req, res) => {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    await s3.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3Key,
        })
    );

    await file.deleteOne();
    res.status(200).json({ message: "File deleted" });
};

module.exports = { uploadFile, listFiles, downloadFile, deleteFile };
