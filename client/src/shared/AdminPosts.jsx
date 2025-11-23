import React, { useEffect, useState } from "react";
import { MessageSquare, Users, TrendingUp, Trash2 } from "lucide-react";
import API from "../api";
import { formatDate, isRecent } from "./formatDate";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  async function fetchPosts() {
    try {
      const res = await API.get("/admin/posts");
      setPosts(res.data);
    } catch (e) {
      console.error("Error fetching posts:", e);
    }
  }

  async function fetchUsers() {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  }

  async function deletePost(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e) {
      alert("Error deleting post");
    }
  }

  function getUserName(userId) {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Unknown";
  }

  return (
    <div>
      <h1 className="admin-page-title">
        <MessageSquare size={28} />
        Posts Management
      </h1>

      {/* Search Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <MessageSquare size={20} />
            All Posts (
            {
              posts.filter((p) =>
                searchTerm
                  ? p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.content.toLowerCase().includes(searchTerm.toLowerCase())
                  : true
              ).length
            }
            )
          </h3>

          <div className="admin-search-controls">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-info">
          <div className="admin-stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Posts</div>
            <div className="admin-stat-value">{posts.length}</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-success">
          <div className="admin-stat-icon">
            <Users size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Active Users</div>
            <div className="admin-stat-value">{users.length}</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-warning">
          <div className="admin-stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Recent Posts</div>
            <div className="admin-stat-value">
              {
                posts.filter((p) => isRecent(p.createdAt, 7)).length
              }
            </div>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No posts found</h3>
          <p>Users haven't created any posts yet</p>
        </div>
      ) : (
        posts
          .filter((p) =>
            searchTerm
              ? p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.content.toLowerCase().includes(searchTerm.toLowerCase())
              : true
          )
          .map((p) => (
            <div key={p.id} className="admin-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong className="admin-info-value">{p.title}</strong>
                  <div style={{ marginTop: 8 }} className="admin-info-label">
                    {p.content}
                  </div>
                  <div className="admin-info-label" style={{ marginTop: 12 }}>
                    By: {getUserName(p.UserId)} | Created:{" "}
                    {formatDate(p.createdAt)}
                    {p.updatedAt !== p.createdAt && (
                      <span>
                        {" "}
                        | Updated: {formatDate(p.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="admin-action-buttons">
                  <button
                    onClick={() => deletePost(p.id)}
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
