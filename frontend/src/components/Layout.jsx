import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

function Icon({ name }) {
  // Minimal-Icons ohne Libraries (SVG)
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  if (name === "menu") return (
    <svg {...common}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  );
  if (name === "home") return (
    <svg {...common}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>
  );
  if (name === "calendar") return (
    <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2.5" x2="16" y2="6"/><line x1="8" y1="2.5" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  );
  if (name === "list") return (
    <svg {...common}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>
  );
  // students
  return (
    <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`appShell ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="brandRow">
          <div className="brand">Unterricht Tracker</div>
          <button className="iconBtn" onClick={() => setCollapsed(v => !v)} title="Menü einklappen/ausklappen">
            <Icon name="menu" />
          </button>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")} title="Start">
            <span className="navIcon"><Icon name="home" /></span>
            <span className="navLabel">Start</span>
          </NavLink>

          <NavLink to="/kalender" className={({ isActive }) => (isActive ? "active" : "")} title="Kalender">
            <span className="navIcon"><Icon name="calendar" /></span>
            <span className="navLabel">Kalender</span>
          </NavLink>

          <NavLink to="/eintraege" className={({ isActive }) => (isActive ? "active" : "")} title="Einträge">
            <span className="navIcon"><Icon name="list" /></span>
            <span className="navLabel">Einträge</span>
          </NavLink>

          <NavLink to="/schueler" className={({ isActive }) => (isActive ? "active" : "")} title="Schülerverwaltung">
            <span className="navIcon"><Icon name="students" /></span>
            <span className="navLabel">Schülerverwaltung</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
