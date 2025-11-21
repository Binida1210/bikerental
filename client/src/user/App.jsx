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

export default function UserApp({ token, setToken, username, setUsername }) {
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
          <Link to="/login" className="btn ghost">
            Logout
          </Link>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/stations" />} />
        </Routes>
      </main>
    </Router>
  );
}
