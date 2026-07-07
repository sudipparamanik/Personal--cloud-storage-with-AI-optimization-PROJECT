import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const { user, checking } = useAuth();
  const [mode, setMode] = useState("login");

  if (checking) {
    return (
      <div className="center-screen">
        <p className="muted">loading…</p>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="center-screen">
      {mode === "login" ? (
        <Login onSwitch={() => setMode("register")} />
      ) : (
        <Register onSwitch={() => setMode("login")} />
      )}
    </div>
  );
}
