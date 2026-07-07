import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const isEmail = form.identifier.includes("@");
      await login({
        [isEmail ? "email" : "username"]: form.identifier,
        password: form.password,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">~/vault</p>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          username or email
          <input
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            required
            autoFocus
          />
        </label>
        <label>
          password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "signing in…" : "sign in"}
        </button>
      </form>
      <p className="switch">
        no account?{" "}
        <button type="button" className="link" onClick={onSwitch}>
          create one
        </button>
      </p>
    </div>
  );
}
