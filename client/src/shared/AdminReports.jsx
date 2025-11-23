import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, RotateCcw, Trash2 } from "lucide-react";
import API from "../api";
import { formatDate, formatDateTime, formatTime } from "./formatDate";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await API.get("/admin/reports");
      setReports(res.data);
    } catch (e) {
      console.error("Error fetching reports:", e);
    }
  }

  async function updateStatus(id, status) {
    try {
      await API.put(`/admin/reports/${id}`, { status });
      setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
      alert(`Report marked as ${status}`);
    } catch (e) {
      console.error("Error updating report status:", e);
      alert(
        "Error updating report status: " +
          (e.response?.data?.error || e.message)
      );
    }
  }

  async function deleteReport(id) {
    if (!window.confirm("Delete this report? This action cannot be undone."))
      return;
    try {
      await API.delete(`/admin/reports/${id}`);
      setReports(reports.filter((r) => r.id !== id));
      alert("Report deleted successfully");
    } catch (e) {
      console.error("Error deleting report:", e);
      alert("Error deleting report: " + (e.response?.data?.error || e.message));
    }
  }

  const filteredReports = reports.filter((r) => {
    // Filter by status
    let matchesStatus = true;
    if (filter !== "all") {
      matchesStatus = r.status === filter;
    }

    // Filter by search term (description or user ID)
    let matchesSearch = true;
    if (searchTerm) {
      matchesSearch =
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId.toString().includes(searchTerm);
    }

    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: reports.length,
    open: reports.filter((r) => r.status === "open").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div>
      <h1 className="admin-page-title">
        <FileText size={28} />
        Reports Management
      </h1>
      {/* Search and Filter Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <FileText size={20} />
            All Reports ({filteredReports.length})
          </h3>

          <div className="admin-search-controls">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="open">Open ({statusCounts.open})</option>
              <option value="resolved">
                Resolved ({statusCounts.resolved})
              </option>
            </select>
          </div>
        </div>
      </div>{" "}
      {filteredReports.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No {filter === "all" ? "" : filter} reports found</h3>
          <p>Everything looks good!</p>
        </div>
      ) : (
        filteredReports.map((r) => (
          <div key={r.id} className="admin-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <strong className="admin-info-value">
                    {r.Station ? r.Station.name : "Unknown Station"}
                  </strong>
                  <span
                    className={`admin-status-badge admin-status-${r.status}`}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }} className="admin-info-label">
                  {r.description}
                </div>
                <div className="admin-info-label">
                  Reporter: {r.User ? r.User.username : "Unknown"} | Date:{" "}
                  {formatDate(r.createdAt)} {formatTime(r.createdAt)}
                </div>
              </div>
              <div className="admin-action-buttons">
                {r.status === "open" ? (
                  <button
                    onClick={() => updateStatus(r.id, "resolved")}
                    className="admin-btn admin-btn-success"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(r.id, "open")}
                    className="admin-btn admin-btn-warning"
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => deleteReport(r.id)}
                  className="admin-btn admin-btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
