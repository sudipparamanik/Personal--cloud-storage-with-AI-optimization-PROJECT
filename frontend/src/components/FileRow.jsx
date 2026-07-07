import { useState } from "react";
import { api } from "../api.js";

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function FileRow({ file, onChange, reason }) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const { url } = await api.getDownloadUrl(file._id);
      window.open(url, "_blank");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${file.originalName}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await api.deleteFile(file._id);
      onChange();
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="file-row">
      <div className="file-info">
        <span className="file-name">{file.originalName}</span>
        <span className="file-meta">
          {formatSize(file.size)} · {new Date(file.createdAt).toLocaleDateString()}
        </span>
        {reason && <span className="file-reason">{reason}</span>}
      </div>
      <div className="file-actions">
        <button disabled={busy} onClick={handleDownload}>
          download
        </button>
        <button disabled={busy} className="danger" onClick={handleDelete}>
          delete
        </button>
      </div>
    </div>
  );
}
