import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "../shared/AdminDashboard";
import Profile from "../shared/Profile";
import Posts from "../shared/Posts";
import Visualization from "../shared/Visualization";

export default function AdminApp({ token, setToken, username, setUsername }) {
  return (
    <Router>
      <header className="app-header">
        <div className="app-title">BikeShare</div>
        <nav className="nav container">
          <Link to="/admin" className="btn">
            Dashboard
          </Link>
          <Link to="/posts" className="btn">
            Posts
          </Link>
          <Link to="/profile" className="btn">
            Profile
          </Link>
          <Link to="/visualization" className="btn">
            Visualization
          </Link>
          <Link to="/login" className="btn ghost">
            Logout
          </Link>
          <span className="muted small right">{username}</span>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="/login" element={<Navigate to="/admin" />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </main>
    </Router>
  );
}
