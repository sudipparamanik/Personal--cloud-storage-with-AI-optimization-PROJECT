const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const TEXT_MIME_PREFIXES = ["text/"];
const TEXT_MIME_EXACT = ["application/json", "application/csv", "application/xml"];

// Extracts plain text from a file buffer so it can be searched/summarized by AI.
// Returns "" for file types we don't know how to read (images, video, zip, etc.)
async function extractText(buffer, mimeType) {
    try {
        if (mimeType === "application/pdf") {
            const data = await pdfParse(buffer);
            return (data.text || "").trim();
        }

        if (
            mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const result = await mammoth.extractRawText({ buffer });
            return (result.value || "").trim();
        }

        const isPlainText =
            TEXT_MIME_PREFIXES.some((prefix) => mimeType?.startsWith(prefix)) ||
            TEXT_MIME_EXACT.includes(mimeType);

        if (isPlainText) {
            return buffer.toString("utf-8").trim();
        }

        return "";
    } catch (err) {
        console.log("Text extraction failed:", err.message);
        return "";
    }
}

module.exports = { extractText };
