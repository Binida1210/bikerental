import React, { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editReportId, setEditReportId] = useState(null);
  const [editReportDesc, setEditReportDesc] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchReports();
  }, []);

  useEffect(() => {
    if (profile) fetchPosts();
  }, [profile]);
  async function fetchPosts() {
    try {
      const res = await API.get("/posts");
      setPosts(res.data?.filter((p) => p.UserId === profile?.id) || []);
    } catch (e) {
      console.error("Error fetching posts:", e);
      setPosts([]);
    }
  }

  async function deleteReport(id) {
    if (!window.confirm("Delete this report?")) return;
    try {
      await API.delete(`/reports/${id}`);
      fetchReports();
    } catch (e) {
      alert("Error deleting report: " + (e.response?.data?.error || e.message));
    }
  }

  function startEditReport(r) {
    setEditReportId(r.id);
    setEditReportDesc(r.description);
  }

  async function saveEditReport(id) {
    try {
      await API.put(`/reports/${id}`, { description: editReportDesc });
      setEditReportId(null);
      setEditReportDesc("");
      fetchReports();
    } catch (e) {
      alert("Error updating report: " + (e.response?.data?.error || e.message));
    }
  }

  async function deletePost(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      if (profile?.role === "admin") {
        await API.delete(`/admin/posts/${id}`);
      } else {
        await API.delete(`/posts/${id}`);
      }
      fetchPosts();
    } catch (e) {
      alert("Error deleting post: " + (e.response?.data?.error || e.message));
    }
  }

  function startEditPost(p) {
    setEditPostId(p.id);
    setEditPostTitle(p.title);
    setEditPostContent(p.content);
  }

  async function saveEditPost(id) {
    try {
      await API.put(`/posts/${id}`, {
        title: editPostTitle,
        content: editPostContent,
      });
      setEditPostId(null);
      setEditPostTitle("");
      setEditPostContent("");
      fetchPosts();
    } catch (e) {
      alert("Error updating post: " + (e.response?.data?.error || e.message));
    }
  }
  async function fetchProfile() {
    try {
      const res = await API.get("/profile");
      setProfile(res.data);
      setUsername(res.data.username);
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  }

  async function fetchReports() {
    try {
      const res = await API.get("/reports/me");
      setReports(res.data || []);
    } catch (e) {
      console.error("Error fetching reports:", e);
      setReports([]);
    }
  }

  async function save(e) {
    e.preventDefault();
    try {
      await API.put("/profile", { username, password: password || undefined });
      alert("Saved");
      setPassword("");
      fetchProfile();
    } catch (e) {
      alert("Error saving profile: " + (e.response?.data?.error || e.message));
    }
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="card">
      <h3>Profile</h3>
      <form onSubmit={save}>
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="new password (leave blank to keep)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>

      <h4>My Reports</h4>
      {reports.length === 0 ? (
        <p>No reports submitted.</p>
      ) : (
        <ul>
          {reports.map((r) => (
            <li key={r.id}>
              <strong>{r.Station?.name || "Unknown Station"}</strong>:{" "}
              {editReportId === r.id ? (
                <>
                  <input
                    value={editReportDesc}
                    onChange={(e) => setEditReportDesc(e.target.value)}
                  />
                  <button onClick={() => saveEditReport(r.id)}>Save</button>
                  <button onClick={() => setEditReportId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {r.description} - Status: {r.status} (
                  {new Date(r.createdAt).toLocaleDateString()})
                  <button onClick={() => startEditReport(r)}>Edit</button>
                  <button onClick={() => deleteReport(r.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h4>My Posts</h4>
      {posts.length === 0 ? (
        <p>No posts.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.id}>
              {editPostId === p.id ? (
                <>
                  <input
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                  />
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                  />
                  <button onClick={() => saveEditPost(p.id)}>Save</button>
                  <button onClick={() => setEditPostId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{p.title}</strong>: {p.content}
                  {(profile.role === "admin" && p.UserId === profile.id) ||
                  p.UserId === profile.id ? (
                    <>
                      <button onClick={() => startEditPost(p)}>Edit</button>
                      <button onClick={() => deletePost(p.id)}>Delete</button>
                    </>
                  ) : (
                    <button onClick={() => deletePost(p.id)}>Delete</button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
