import React from "react";
import { NavLink } from "react-router-dom";

// Mobile bottom nav specifically for small screens. Keeps styling separate
// from the main sidebar to avoid CSS conflicts.
export default function MobileNav({ links = [], open = false, onClose } ) {
  return (
    <>
      {/* overlay: closes nav when clicked */}
      <div
        className={`user-mobile-nav-overlay ${open ? "open" : ""}`}
        onClick={() => onClose && onClose()}
      />

      <nav
        className={`user-mobile-nav ${open ? "open" : ""}`}
        role="navigation"
        aria-label="Mobile nav"
      >
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            className={({ isActive }) =>
              `user-mobile-nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => onClose && onClose()}
          >
            <div className="user-mobile-nav-icon">{l.icon}</div>
            <div className="user-mobile-nav-label">{l.label}</div>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
