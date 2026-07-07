const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

// Thin wrapper around the Anthropic Messages API.
async function callClaude({ system, messages, maxTokens = 1024 }) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not set in the environment");
    }

    const res = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            system,
            messages,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Claude API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const textBlock = data.content?.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
}

module.exports = { callClaude };
