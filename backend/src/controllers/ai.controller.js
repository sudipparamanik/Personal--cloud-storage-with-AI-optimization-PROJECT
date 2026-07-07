const File = require("../models/File");
const { callClaude } = require("../services/claude");

const MAX_FILES_IN_CONTEXT = 40; // how many of the user's files we consider per query
const SNIPPET_CHARS = 2000; // per-file content sent during ranking
const CHAT_CONTEXT_CHARS = 4000; // per-file content sent when answering a question

function buildFileSummaries(files) {
    return files
        .map((f) => {
            const snippet = (f.content || "").slice(0, SNIPPET_CHARS);
            return `id: ${f._id}\nname: ${f.originalName}\ntype: ${f.mimeType}\ncontent: ${
                snippet || "(no extracted text - binary/media file, match on name only)"
            }`;
        })
        .join("\n\n---\n\n");
}

function parseJsonArray(raw) {
    try {
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Shared step: given a query, ask Claude which of the user's files are relevant.
async function rankRelevantFiles(ownerId, query, limit) {
    const files = await File.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .limit(MAX_FILES_IN_CONTEXT);

    if (files.length === 0) return [];

    const system = `You help search a user's uploaded files. You'll get a list of files (name, type, and extracted text content) and a query. Return ONLY a JSON array, nothing else, shaped like: [{"id": "...", "reason": "under 12 words"}]. Order most relevant first. Only include files that are genuinely relevant to the query - omit the rest. If nothing matches, return [].`;

    const userMessage = `Files:\n\n${buildFileSummaries(files)}\n\nQuery: "${query}"`;

    const raw = await callClaude({
        system,
        messages: [{ role: "user", content: userMessage }],
        maxTokens: 1024,
    });

    const parsed = parseJsonArray(raw);
    const fileMap = new Map(files.map((f) => [String(f._id), f]));

    return parsed
        .map((r) => {
            const file = fileMap.get(String(r.id));
            if (!file) return null;
            return {
                _id: file._id,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                createdAt: file.createdAt,
                reason: r.reason,
            };
        })
        .filter(Boolean)
        .slice(0, limit);
}

const smartSearch = async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        const results = await rankRelevantFiles(req.user._id, query, 10);
        res.status(200).json({ results });
    } catch (err) {
        res.status(500).json({ message: "Search failed", detail: err.message });
    }
};

const chatWithFiles = async (req, res) => {
    const { question } = req.body;
    if (!question || !question.trim()) {
        return res.status(400).json({ message: "Question is required" });
    }

    try {
        const relevant = await rankRelevantFiles(req.user._id, question, 5);

        if (relevant.length === 0) {
            return res.status(200).json({
                answer: "I couldn't find any files relevant to that question.",
                sources: [],
            });
        }

        const fullFiles = await File.find({
            _id: { $in: relevant.map((r) => r._id) },
            owner: req.user._id,
        });

        const context = fullFiles
            .map(
                (f) =>
                    `File: ${f.originalName}\nContent:\n${
                        (f.content || "(no extracted text available)").slice(0, CHAT_CONTEXT_CHARS)
                    }`
            )
            .join("\n\n---\n\n");

        const system = `Answer the question using only the file contents given below. Be concise. If the files don't contain the answer, say so plainly instead of guessing. Mention which file(s) the answer came from.`;

        const answer = await callClaude({
            system,
            messages: [
                { role: "user", content: `Files:\n\n${context}\n\nQuestion: ${question}` },
            ],
            maxTokens: 1024,
        });

        res.status(200).json({
            answer,
            sources: relevant.map((r) => ({ id: r._id, name: r.originalName })),
        });
    } catch (err) {
        res.status(500).json({ message: "Chat failed", detail: err.message });
    }
};

module.exports = { smartSearch, chatWithFiles };
