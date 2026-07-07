import { useState } from "react";
import { api } from "../api.js";

export default function SearchBar({ onResults, onClear }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await api.smartSearch(query);
      onResults(data.results, query);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuery("");
    onClear();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search your files with AI…"
      />
      <button type="submit" disabled={loading}>
        {loading ? "searching…" : "search"}
      </button>
      {query && (
        <button type="button" className="link" onClick={handleClear}>
          clear
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
