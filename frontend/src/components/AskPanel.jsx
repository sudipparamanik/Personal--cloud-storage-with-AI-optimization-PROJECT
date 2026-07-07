import { useState } from "react";
import { api } from "../api.js";

export default function AskPanel() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setQuestion("");
    setLoading(true);
    setThread((t) => [...t, { role: "question", text: q }]);
    try {
      const data = await api.chatWithFiles(q);
      setThread((t) => [
        ...t,
        { role: "answer", text: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setThread((t) => [...t, { role: "answer", text: `Error: ${err.message}`, sources: [] }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button className="ask-toggle" onClick={() => setOpen(true)}>
        ask AI about your files
      </button>
    );
  }

  return (
    <div className="ask-panel">
      <div className="ask-header">
        <span>ask AI about your files</span>
        <button type="button" className="link" onClick={() => setOpen(false)}>
          close
        </button>
      </div>

      <div className="ask-thread">
        {thread.length === 0 && (
          <p className="muted">
            ask something like "what's in my project brief?" or "find the file with the budget numbers"
          </p>
        )}
        {thread.map((msg, i) =>
          msg.role === "question" ? (
            <p key={i} className="ask-question">
              {msg.text}
            </p>
          ) : (
            <div key={i} className="ask-answer">
              <p>{msg.text}</p>
              {msg.sources?.length > 0 && (
                <p className="ask-sources">
                  from: {msg.sources.map((s) => s.name).join(", ")}
                </p>
              )}
            </div>
          )
        )}
        {loading && <p className="muted">thinking…</p>}
      </div>

      <form className="ask-input-row" onSubmit={handleSubmit}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="ask a question about your files…"
        />
        <button type="submit" disabled={loading}>
          ask
        </button>
      </form>
    </div>
  );
}
