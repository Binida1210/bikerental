// Admin App Entry - Router wrapper
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Profile from "../shared/Profile";
import Visualization from "../shared/Visualization";
import Login from "../shared/Login";
import "./admin.css";

export default function AdminIndex({
  token,
  setToken,
  username,
  setUsername,
  onLogout,
}) {
  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  if (!token) {
    return (
      <div className="admin-layout">
        <Router>
          <div
            className="admin-content"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              background: "var(--gray-50)",
            }}
          >
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }

  return (
    <Router>
      <AdminLayout
        username={username || localStorage.getItem("username")}
        onLogout={handleLogout}
      />
    </Router>
  );
}
