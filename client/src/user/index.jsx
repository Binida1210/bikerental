// User App Entry - Router wrapper
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Stations from "../shared/Stations";
import MapView from "../shared/MapView";
import Posts from "../shared/Posts";
import ReportForm from "../shared/ReportForm";
import Rentals from "../shared/Rentals";
import Profile from "../shared/Profile";
import Visualization from "../shared/Visualization";
import Login from "../shared/Login";
import Register from "../shared/Register";

export default function UserIndex({
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
      <Router>
        <header className="app-header">
          <div className="app-title">따릉이 - BikeShare (User)</div>
          <nav className="nav container">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/register" className="btn secondary">
              Register
            </Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<Register onRegister={handleLogin} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </Router>
    );
  }

  return (
    <Router>
      <header className="app-header">
        <div className="app-title">따릉이 - BikeShare (User)</div>
        <nav className="nav container">
          <Link to="/stations" className="btn">
            Stations
          </Link>
          <Link to="/map" className="btn">
            Map
          </Link>
          <Link to="/posts" className="btn">
            Posts
          </Link>
          <Link to="/report" className="btn">
            Report
          </Link>
          <Link to="/rentals" className="btn">
            My Rentals
          </Link>
          <Link to="/profile" className="btn">
            Profile
          </Link>
          <Link to="/visualization" className="btn">
            Visualization
          </Link>
          <button className="btn ghost" onClick={handleLogout}>
            Logout
          </button>
          <span className="muted small right">{username}</span>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/stations" element={<Stations />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="*" element={<Navigate to="/stations" />} />
        </Routes>
      </main>
    </Router>
  );
}
