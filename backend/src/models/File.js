const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        s3Key: {
            type: String,
            required: true,
            unique: true,
        },
        mimeType: {
            type: String,
        },
        size: {
            type: Number,
        },
        content: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("File", fileSchema);
