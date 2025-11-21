import React, { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  CheckCircle,
  X,
  Minus,
  BikeIcon,
} from "lucide-react";
import API from "../api";

export default function AdminStations() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [newStation, setNewStation] = useState({
    name: "",
    lat: "",
    lng: "",
    capacity: 10,
    available: 0,
    open: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    try {
      const res = await API.get("/admin/stations");
      setStations(res.data);
      setFilteredStations(res.data);
    } catch (e) {
      console.error("Error fetching stations:", e);
    }
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = stations.filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.id.toString().includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "open" && station.open) ||
        (statusFilter === "closed" && !station.open);
      return matchesSearch && matchesStatus;
    });
    setFilteredStations(filtered);
  }, [stations, searchTerm, statusFilter]);

  async function createStation(e) {
    e.preventDefault();
    try {
      const payload = {
        name: newStation.name,
        lat: parseFloat(newStation.lat),
        lng: parseFloat(newStation.lng),
        capacity: Number(newStation.capacity),
        available: Number(newStation.available),
        open: newStation.open,
      };
      await API.post("/admin/stations", payload);
      setNewStation({
        name: "",
        lat: "",
        lng: "",
        capacity: 10,
        available: 0,
        open: true,
      });
      fetchStations();
    } catch (e) {
      alert("Error creating station");
    }
  }

  async function updateStation(id, data) {
    try {
      await API.put(`/admin/stations/${id}`, data);
      fetchStations();
    } catch (e) {
      alert("Error updating station");
    }
  }

  async function deleteStation(id) {
    if (!window.confirm("Delete station? This action cannot be undone."))
      return;
    try {
      await API.delete(`/admin/stations/${id}`);
      fetchStations();
    } catch (e) {
      alert("Error deleting station");
    }
  }

  async function changeInventory(id, delta) {
    try {
      await API.post(`/admin/stations/${id}/inventory`, { delta });
      fetchStations();
    } catch (e) {
      alert(e.response?.data?.error || "Error updating inventory");
    }
  }

  function startEdit(station) {
    setEditingId(station.id);
    setEditingData({
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      capacity: station.capacity,
      available: station.available,
      open: station.open,
    });
  }

  function saveEdit(id) {
    updateStation(id, editingData);
    setEditingId(null);
    setEditingData({});
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingData({});
  }

  return (
    <div>
      <h1 className="admin-page-title">
        <MapPin size={28} />
        Stations Management
      </h1>

      {/* Create New Station */}
      <div className="admin-card">
        <h3 className="admin-card-title">
          <Plus size={20} />
          Create New Station
        </h3>
        <form onSubmit={createStation}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <input
              placeholder="Station Name"
              className="admin-input"
              value={newStation.name}
              onChange={(e) =>
                setNewStation({ ...newStation, name: e.target.value })
              }
              required
            />
            <input
              placeholder="Capacity"
              className="admin-input"
              type="number"
              value={newStation.capacity}
              onChange={(e) =>
                setNewStation({ ...newStation, capacity: e.target.value })
              }
              min="1"
              required
            />
            <input
              placeholder="Latitude"
              className="admin-input"
              type="number"
              step="any"
              value={newStation.lat}
              onChange={(e) =>
                setNewStation({ ...newStation, lat: e.target.value })
              }
              required
            />
            <input
              placeholder="Longitude"
              className="admin-input"
              type="number"
              step="any"
              value={newStation.lng}
              onChange={(e) =>
                setNewStation({ ...newStation, lng: e.target.value })
              }
              required
            />
            <input
              placeholder="Available Bikes"
              className="admin-input"
              type="number"
              value={newStation.available}
              onChange={(e) =>
                setNewStation({ ...newStation, available: e.target.value })
              }
              min="0"
              required
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={newStation.open}
                  onChange={(e) =>
                    setNewStation({ ...newStation, open: e.target.checked })
                  }
                />
                Station Open
              </label>
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">
            Create Station
          </button>
        </form>
      </div>

      {/* Stations List */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-info">
          <div className="admin-stat-icon">
            <MapPin size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Stations</div>
            <div className="admin-stat-value">{stations.length}</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-success">
          <div className="admin-stat-icon">
            <Power size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Open Stations</div>
            <div className="admin-stat-value">
              {stations.filter((s) => s.open).length}
            </div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-warning">
          <div className="admin-stat-icon">
            <BikeIcon size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Bikes</div>
            <div className="admin-stat-value">
              {filteredStations.reduce((sum, s) => sum + s.available, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <MapPin size={20} />
            All Stations ({filteredStations.length})
          </h3>

          <div className="admin-search-controls">
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Status</option>
              <option value="open">Open Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
        </div>
      </div>

      {filteredStations.map((station) => (
        <div key={station.id} className="admin-card">
          {editingId === station.id ? (
            // Edit Mode
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <input
                  placeholder="Station Name"
                  className="admin-input"
                  value={editingData.name}
                  onChange={(e) =>
                    setEditingData({ ...editingData, name: e.target.value })
                  }
                />
                <input
                  placeholder="Capacity"
                  className="admin-input"
                  type="number"
                  value={editingData.capacity}
                  onChange={(e) =>
                    setEditingData({ ...editingData, capacity: e.target.value })
                  }
                />
                <input
                  placeholder="Latitude"
                  className="admin-input"
                  type="number"
                  step="any"
                  value={editingData.lat}
                  onChange={(e) =>
                    setEditingData({ ...editingData, lat: e.target.value })
                  }
                />
                <input
                  placeholder="Longitude"
                  className="admin-input"
                  type="number"
                  step="any"
                  value={editingData.lng}
                  onChange={(e) =>
                    setEditingData({ ...editingData, lng: e.target.value })
                  }
                />
                <input
                  placeholder="Available"
                  className="admin-input"
                  type="number"
                  value={editingData.available}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      available: e.target.value,
                    })
                  }
                />
                <div>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingData.open}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          open: e.target.checked,
                        })
                      }
                    />
                    Station Open
                  </label>
                </div>
              </div>
              <div className="admin-action-buttons">
                <button
                  onClick={() => saveEdit(station.id)}
                  className="admin-btn admin-btn-success"
                >
                  <CheckCircle size={16} />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="admin-btn admin-btn-secondary"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong className="admin-info-value">{station.name}</strong>
                    <span
                      className={`admin-status-badge admin-status-${
                        station.open ? "open" : "closed"
                      }`}
                    >
                      {station.open ? "OPEN" : "CLOSED"}
                    </span>
                  </div>
                  <div className="admin-info-label">
                    <MapPin
                      size={14}
                      style={{ display: "inline", marginRight: "4px" }}
                    />
                    Location: {station.lat}, {station.lng}
                  </div>
                  <div className="admin-info-label">
                    Available:{" "}
                    <strong className="admin-info-value">
                      {station.available}
                    </strong>{" "}
                    / {station.capacity} bikes
                  </div>
                </div>
                <div className="admin-action-buttons">
                  <div className="admin-inventory-controls">
                    <button
                      onClick={() => changeInventory(station.id, 1)}
                      className="admin-btn admin-btn-sm admin-btn-success"
                    >
                      Add Bike
                    </button>
                    <button
                      onClick={() => changeInventory(station.id, -1)}
                      className="admin-btn admin-btn-sm admin-btn-warning"
                      disabled={station.available <= 0}
                    >
                      Remove Bike
                    </button>
                  </div>
                  <div className="admin-station-controls">
                    <button
                      onClick={() =>
                        updateStation(station.id, {
                          ...station,
                          open: !station.open,
                        })
                      }
                      className={`admin-btn admin-btn-sm ${
                        station.open ? "admin-btn-warning" : "admin-btn-success"
                      }`}
                    >
                      {station.open ? "Close" : "Open"}
                    </button>
                    <button
                      onClick={() => startEdit(station)}
                      className="admin-btn admin-btn-sm admin-btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStation(station.id)}
                      className="admin-btn admin-btn-sm admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
