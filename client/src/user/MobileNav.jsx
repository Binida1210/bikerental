import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bike,
  User,
  LogOut,
} from "lucide-react";

const mobileLinks = [
  { label: "Home", path: "/home", icon: <LayoutDashboard size={18} /> },
  { label: "Posts", path: "/posts", icon: <MessageSquare size={18} /> },
  { label: "Report", path: "/report", icon: <FileText size={18} /> },
  { label: "Rentals", path: "/rentals", icon: <Bike size={18} /> },
  { label: "Profile", path: "/profile", icon: <User size={18} /> },
];

export default function MobileNav({ onLogout }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <div className="mobile-nav-inner">
        {mobileLinks.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            className={({ isActive }) =>
              `mobile-nav__item ${isActive ? "mobile-nav__item--active" : ""}`
            }
          >
            <div className="mobile-nav__icon">{l.icon}</div>
            <div className="mobile-nav__label">{l.label}</div>
          </NavLink>
        ))}

        {/* logout as separate item */}
        <button
          className="mobile-nav__item mobile-nav__logout"
          onClick={onLogout}
          title="Logout"
        >
          <div className="mobile-nav__icon">
            <LogOut size={18} />
          </div>
          <div className="mobile-nav__label">Logout</div>
        </button>
      </div>
    </nav>
  );
}
