import React, { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./admin.css";

import AdminDashboard from "../shared/AdminDashboard";
import AdminUsers from "../shared/AdminUsers";
import AdminStations from "../shared/AdminStations";
import AdminReports from "../shared/AdminReports";
import AdminPosts from "../shared/AdminPosts";

export default function AdminLayout({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users size={20} />,
    },
    {
      id: "stations",
      label: "Stations",
      icon: <MapPin size={20} />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText size={20} />,
    },
    {
      id: "posts",
      label: "Posts",
      icon: <MessageSquare size={20} />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "stations":
        return <AdminStations />;
      case "reports":
        return <AdminReports />;
      case "posts":
        return <AdminPosts />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <MapPin size={24} />
            BikeRental Admin
          </div>
          {username && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--gray-600)",
                marginTop: "0.5rem",
              }}
            >
              Welcome, {username}
            </div>
          )}
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`admin-nav-item ${
                activeTab === item.id ? "active" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <button onClick={logout} className="admin-nav-item">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Mobile Header */}
        <div
          className="admin-mobile-header"
          style={{
            display: "none",
            padding: "1rem",
            background: "white",
            borderBottom: "1px solid var(--gray-200)",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-btn admin-btn-ghost"
          >
            <Menu size={20} />
          </button>
          <div className="admin-logo">BikeRental Admin</div>
        </div>

        <div className="admin-content">{renderContent()}</div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
}
