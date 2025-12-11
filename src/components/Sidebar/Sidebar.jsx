import React from "react";
import { FaUsers, FaClipboardList, FaHome, FaChevronLeft, FaFileInvoice,FaRupeeSign } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LogoutButton from "../LogoutButton/LogoutButton";
import logo from "../../assets/swpalogo.png";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const MenuItem = ({ icon, title, path }) => (
    <li
      className={pathname === path ? "menu active" : "menu"}
      onClick={() => navigate(path)}
    >
      {icon}
      {!collapsed && <span>{title}</span>}
    </li>
  );

  return (
    <aside className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>

      {/* Collapse Button */}
      <button className="collapse-btn" onClick={toggleSidebar}>
        <FaChevronLeft className={collapsed ? "rotate" : ""} />
      </button>

      {/* Logo & Name */}
      <div className="brand-box">
        <img src={logo} className="brand-logo" alt="SWPA" />
        {!collapsed && <h2>SWPA ADMIN</h2>}
      </div>

      {/* MENU ITEMS */}
      <ul className="menu-list">
        <MenuItem icon={<FaHome />} title="Dashboard" path="/adminDashboard" />
        <MenuItem icon={<FaUsers />} title="Students" path="/adminDashboard/students" />
        <MenuItem icon={<FaClipboardList />} title="Assignments" path="/adminDashboard/assignments" />
        <MenuItem icon={<FaRupeeSign />} title="Finance" path="/adminDashboard/finance" />
        <MenuItem icon={<FaFileInvoice />} title="Documents" path="/adminDashboard/documents" />
      </ul>

      {/* LOGOUT */}
      <div className="logout-area">
        <LogoutButton collapsed={collapsed} />
      </div>

    </aside>
  );
}
