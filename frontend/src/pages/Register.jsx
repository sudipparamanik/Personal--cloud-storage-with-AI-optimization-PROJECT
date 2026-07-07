import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">~/vault</p>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          username
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoFocus
          />
        </label>
        <label>
          email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "creating…" : "create account"}
        </button>
      </form>
      <p className="switch">
        already have one?{" "}
        <button type="button" className="link" onClick={onSwitch}>
          sign in
        </button>
      </p>
    </div>
  );
}
