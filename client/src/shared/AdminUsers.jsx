import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import API from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  async function updateUserRole(userId, newRole) {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setEditingId(null);
    } catch (e) {
      console.error("Error updating user role:", e);
      alert("Failed to update user role");
    }
  }

  async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (e) {
      console.error("Error deleting user:", e);
      alert("Failed to delete user");
    }
  }

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditingRole(user.role);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingRole("");
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "user":
        return "badge-user";
      default:
        return "badge-default";
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="admin-section-title">
          <Users size={20} />
          Loading Users...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          <Users size={24} />
          User Management
        </h1>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <Users size={20} />
            All Users ({filteredUsers.length})
          </h2>

          {/* Search and Filter Controls */}
          <div className="admin-search-controls">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin Only</option>
              <option value="user">Users Only</option>
            </select>
          </div>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>User ID: {user.id}</td>
                  <td>{user.username}</td>
                  <td>
                    {editingId === user.id ? (
                      <div className="admin-edit-form">
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => updateUserRole(user.id, editingRole)}
                          className="admin-btn admin-btn-sm admin-btn-primary"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="admin-btn admin-btn-sm admin-btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`admin-badge ${getRoleBadgeClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId !== user.id && (
                      <div className="admin-table-actions">
                        <button
                          onClick={() => startEditing(user)}
                          className="admin-btn admin-btn-sm admin-btn-ghost"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
