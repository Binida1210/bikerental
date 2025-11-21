import React, { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  FileText,
  Bike,
  MessageSquare,
  Trash2,
} from "lucide-react";
import API from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadStations(),
        loadReports(),
        loadPosts(),
      ]);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
    setLoading(false);
  }

  async function loadUsers() {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (e) {
      console.error("Error loading users:", e);
    }
  }

  async function loadStations() {
    try {
      const res = await API.get("/admin/stations");
      setStations(res.data || []);
    } catch (e) {
      console.error("Error loading stations:", e);
    }
  }

  async function loadReports() {
    try {
      const res = await API.get("/admin/reports");
      setReports(res.data || []);
    } catch (e) {
      console.error("Error loading reports:", e);
    }
  }

  async function loadPosts() {
    try {
      const res = await API.get("/admin/posts");
      setPosts(res.data || []);
    } catch (e) {
      console.error("Error loading posts:", e);
    }
  }

  async function updateReportStatus(id, status) {
    try {
      await API.put(`/admin/reports/${id}`, { status });
      loadReports();
    } catch (e) {
      alert("Error updating report");
    }
  }

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  async function setRole(id, role) {
    await API.put(`/admin/users/${id}/role`, { role });
    load();
  }

  async function createStation(e) {
    e.preventDefault();
    try {
      const payload = {
        name: newStation.name,
        lat: parseFloat(newStation.lat),
        lng: parseFloat(newStation.lng),
        capacity: Number(newStation.capacity),
        available: Number(newStation.available),
        open: true,
      };
      await API.post("/admin/stations", payload);
      setNewStation({ name: "", lat: "", lng: "", capacity: 10, available: 0 });
      loadStations();
    } catch (e) {
      alert("Error creating station");
    }
  }

  async function changeInventory(id, delta) {
    try {
      await API.post(`/admin/stations/${id}/inventory`, { delta });
      loadStations();
    } catch (e) {
      alert(e.response?.data?.error || "Error");
    }
  }

  async function deleteStation(id) {
    if (!confirm("Delete station? This action cannot be undone.")) return;
    try {
      await API.delete(`/admin/stations/${id}`);
      loadStations();
    } catch (e) {
      alert("Error deleting station");
    }
  }

  async function toggleOpen(id, current) {
    try {
      await API.put(`/admin/stations/${id}`, { open: !current });
      loadStations();
    } catch (e) {
      alert("Error toggling open/closed");
    }
  }

  function startEdit(s) {
    setEditingId(s.id);
    setEditingData({
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      capacity: s.capacity,
      available: s.available,
      open: !!s.open,
    });
  }

  async function saveEdit(id) {
    try {
      await API.put(`/admin/stations/${id}`, editingData);
      setEditingId(null);
      setEditingData({});
      loadStations();
    } catch (e) {
      alert(e.response?.data?.error || "Error saving");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingData({});
  }

  async function setCapacity(id, capacity) {
    try {
      await API.post(`/admin/stations/${id}/capacity`, { capacity });
      loadStations();
    } catch (e) {
      alert("Error");
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalStations: stations.length,
    openReports: reports.filter((r) => r.status === "open").length,
    totalPosts: posts.length,
    activeStations: stations.filter((s) => s.open).length,
    totalBikes: stations.reduce((sum, s) => sum + s.available, 0),
  };

  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-primary">
          <div className="admin-stat-icon">
            <Users size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Users</div>
            <div className="admin-stat-value">{stats.totalUsers}</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-success">
          <div className="admin-stat-icon">
            <MapPin size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Active Stations</div>
            <div className="admin-stat-value">
              {stats.activeStations}/{stats.totalStations}
            </div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-warning">
          <div className="admin-stat-icon">
            <FileText size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Open Reports</div>
            <div className="admin-stat-value">{stats.openReports}</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-info">
          <div className="admin-stat-icon">
            <Bike size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Available Bikes</div>
            <div className="admin-stat-value">{stats.totalBikes}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Recent Reports */}
        <div className="admin-card">
          <h4 className="admin-section-title">
            <FileText
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Recent Reports
          </h4>
          {reports.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No Reports</h3>
              <p>All systems running smoothly!</p>
            </div>
          ) : (
            <div>
              {reports.slice(0, 5).map((r) => (
                <div key={r.id} className="admin-info-row">
                  <div>
                    <div className="admin-info-value">
                      {r.Station ? r.Station.name : "Unknown Station"}
                    </div>
                    <div className="admin-info-label">{r.description}</div>
                  </div>
                  <span
                    className={`admin-status-badge admin-status-${r.status}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
              {reports.length > 5 && (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <span className="admin-info-label">
                    +{reports.length - 5} more reports
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Station Overview */}
        <div className="admin-card">
          <h4 className="admin-section-title">
            <MapPin
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Station Overview
          </h4>
          {stations.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No Stations</h3>
              <p>Create your first bike station!</p>
            </div>
          ) : (
            <div>
              {stations.slice(0, 5).map((s) => (
                <div key={s.id} className="admin-info-row">
                  <div>
                    <div className="admin-info-value">{s.name}</div>
                    <div className="admin-info-label">
                      {s.available}/{s.capacity} bikes available
                    </div>
                  </div>
                  <span
                    className={`admin-status-badge admin-status-${
                      s.open ? "active" : "closed"
                    }`}
                  >
                    {s.open ? "Open" : "Closed"}
                  </span>
                </div>
              ))}
              {stations.length > 5 && (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <span className="admin-info-label">
                    +{stations.length - 5} more stations
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Management */}
        <div className="admin-card">
          <h4 className="admin-section-title">
            <Users
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            User Management
          </h4>
          {users.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No Users</h3>
              <p>No registered users yet.</p>
            </div>
          ) : (
            <div>
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="admin-info-row">
                  <div>
                    <div className="admin-info-value">{u.username}</div>
                    <div className="admin-info-label">User ID: {u.id}</div>
                  </div>
                  <div className="admin-action-buttons">
                    <button
                      className={`admin-btn ${
                        u.role === "admin"
                          ? "admin-btn-warning"
                          : "admin-btn-secondary"
                      }`}
                      onClick={() =>
                        setRole(u.id, u.role === "admin" ? "user" : "admin")
                      }
                    >
                      {u.role === "admin" ? "Admin" : "User"}
                    </button>
                  </div>
                </div>
              ))}
              {users.length > 5 && (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <span className="admin-info-label">
                    +{users.length - 5} more users
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="admin-card">
          <h4 className="admin-section-title">
            <MessageSquare
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Recent Posts
          </h4>
          {posts.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No Posts</h3>
              <p>No user posts yet.</p>
            </div>
          ) : (
            <div>
              {posts.slice(0, 5).map((p) => (
                <div key={p.id} className="admin-info-row">
                  <div>
                    <div className="admin-info-value">{p.title}</div>
                    <div className="admin-info-label">
                      By: {p.User ? p.User.username : "Unknown"}
                    </div>
                  </div>
                  <div className="admin-action-buttons">
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={async () => {
                        if (window.confirm("Delete this post?")) {
                          try {
                            await API.delete(`/admin/posts/${p.id}`);
                            setPosts(posts.filter((post) => post.id !== p.id));
                          } catch (e) {
                            alert("Error deleting post");
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {posts.length > 5 && (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <span className="admin-info-label">
                    +{posts.length - 5} more posts
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
