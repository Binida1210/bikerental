import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Stations from "./pages/Stations";
import AdminIndex from "./admin/index";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import ReportForm from "./pages/ReportForm";
import Visualization from "./pages/Visualization";
import MapView from "./pages/MapView";
import Rentals from "./pages/Rentals";
import { setToken } from "./api";
import API from "./api";

export default function App() {
  const [token, setTok] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("home");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setToken(token);
    if (token) loadProfile();
    else setUsername("");
  }, [token]);

  async function loadProfile() {
    try {
      const res = await API.get("/profile");
      setUsername(res.data.username);
    } catch (e) {
      setUsername("");
    }
  }

  function handleLogin(t) {
    localStorage.setItem("token", t);
    setTok(t);
    setPage("home");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    setTok(null);
    setPage("home");
    setToken(null);
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-title">따릉이 - BikeShare</div>
        <div className="nav container">
          {!token && (
            <button className="btn" onClick={() => setPage("login")}>
              Login
            </button>
          )}
          {!token && (
            <button
              className="btn secondary"
              onClick={() => setPage("register")}
            >
              Register
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("stations")}>
              Stations
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("map")}>
              Map
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("posts")}>
              Posts
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("report")}>
              Report
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("rentals")}>
              My Rentals
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("profile")}>
              Profile
            </button>
          )}
          {token && (
            <button className="btn" onClick={() => setPage("visual")}>
              Visualization
            </button>
          )}
          {token && localStorage.getItem("isAdmin") === "true" && (
            <button className="btn" onClick={() => setPage("admin")}>
              Admin
            </button>
          )}
          {token && (
            <button className="btn ghost" onClick={logout}>
              Logout
            </button>
          )}
          {token && <div className="muted small right">{username}</div>}
        </div>
      </header>

      <main className="container">
        {!token && page === "login" && <Login onLogin={handleLogin} />}
        {!token && page === "register" && <Register onRegister={handleLogin} />}

        {token && page === "stations" && <Stations />}
        {token && page === "map" && <MapView />}
        {token && page === "posts" && <Posts />}
        {token && page === "report" && <ReportForm />}
        {token && page === "rentals" && <Rentals />}
        {token && page === "profile" && <Profile />}
        {token && page === "visual" && <Visualization />}
        {token && page === "admin" && (
          <AdminIndex
            token={token}
            setToken={setTok}
            username={username}
            setUsername={setUsername}
            onLogout={logout}
          />
        )}

        {!token && page === "home" && (
          <div className="card">
            <h2>Welcome to Bike Rental</h2>
            <p className="muted">Please Login or Register to continue.</p>
          </div>
        )}
      </main>
    </div>
  );
}
