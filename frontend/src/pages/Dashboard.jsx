import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import UploadBox from "../components/UploadBox.jsx";
import FileRow from "../components/FileRow.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AskPanel from "../components/AskPanel.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searching
  const [searchQuery, setSearchQuery] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const data = await api.listFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const showingSearch = searchResults !== null;
  const visibleFiles = showingSearch ? searchResults : files;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <p className="eyebrow">~/vault</p>
          <h1>{user.username}'s files</h1>
        </div>
        <button className="link" onClick={logout}>
          log out
        </button>
      </header>

      <UploadBox onUploaded={refresh} />

      <SearchBar
        onResults={(results, query) => {
          setSearchResults(results);
          setSearchQuery(query);
        }}
        onClear={() => setSearchResults(null)}
      />

      {error && <p className="error">{error}</p>}

      {showingSearch && (
        <p className="muted search-status">
          {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for "{searchQuery}"
        </p>
      )}

      {loading ? (
        <p className="muted">loading…</p>
      ) : visibleFiles.length === 0 ? (
        <p className="muted">
          {showingSearch
            ? "no matching files found."
            : "nothing here yet — upload your first file above."}
        </p>
      ) : (
        <div className="file-list">
          {visibleFiles.map((f) => (
            <FileRow key={f._id} file={f} onChange={refresh} reason={f.reason} />
          ))}
        </div>
      )}

      <AskPanel />
    </div>
  );
}
