import React, { useState } from "react";
import { FaUsers, FaClipboardList, FaHome, FaChevronLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LogoutButton from "../LogoutButton/LogoutButton";
import logo from "../../assets/swpalogo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false); // sidebar collapse state

  const toggleSidebar = () => setCollapsed(!collapsed);

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
    <>
    
    <aside className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      {/* Collapse Button */}
      <button className="collapse-btn" onClick={toggleSidebar}>
        <FaChevronLeft className={collapsed ? "rotate" : ""} />
      </button>
      

      {/* Logo & Title */}
      <div className="brand-box">
        <img src={logo} className="brand-logo" alt="SWPA" />
        {!collapsed && <h2>SWPA ADMIN</h2>}
      </div>

      {/* MENU */}
      <ul className="menu-list">
        <MenuItem icon={<FaHome />} title="Dashboard" path="/adminDashboard" />
        <MenuItem icon={<FaUsers />} title="Manage Students" path="/adminDashboard/students" />
        <MenuItem icon={<FaClipboardList />} title="Assignments" path="/adminDashboard/assignments" />
      </ul>

      {/* Logout Button */}
      <div className="logout-area">
        <LogoutButton collapsed={collapsed} /> {/* You can hide/show text inside logout component */}
      </div>
    </aside>

    </>
  );
}
