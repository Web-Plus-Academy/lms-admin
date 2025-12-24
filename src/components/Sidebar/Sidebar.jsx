import React, { useState } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaHome,
  FaChevronLeft,
  FaFileInvoice,
  FaRupeeSign,
  FaRegBell,
  FaVideo,
  FaBookOpen,
  FaUserGraduate,
  FaCalendarAlt,
  FaChevronDown,
  FaChalkboardTeacher
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LogoutButton from "../LogoutButton/LogoutButton";
import logo from "../../assets/swpalogo.png";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openApp, setOpenApp] = useState(true);
  const [openLearn, setOpenLearn] = useState(false);
  const [openGeneral, setOpenGeneral] = useState(false);

  const MenuItem = ({ icon, title, path }) => (
    <li
      className={pathname === path ? "menu active" : "menu"}
      onClick={() => navigate(path)}
    >
      {icon}
      {!collapsed && <span>{title}</span>}
    </li>
  );

  const SectionHeader = ({ title, open, toggle }) => (
    <div
      className={`menu-section-header ${open ? "active" : ""}`}
      onClick={toggle}
    >
      <span>{!collapsed && title}</span>
      {!collapsed && (
        <FaChevronDown className={`section-arrow ${open ? "open" : ""}`} />
      )}
    </div>
  );


  return (
    <aside className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>

      {/* Collapse Button */}
      <button className="collapse-btn" onClick={toggleSidebar}>
        <FaChevronLeft className={collapsed ? "rotate" : ""} />
      </button>

      {/* Brand */}
      <div className="brand-box">
        <img src={logo} className="brand-logo" alt="SWPA" />
        {!collapsed && <h2>SWPA ADMIN</h2>}
      </div>

      <div className="sidebar-scroll">
        <ul className="menu-list">

          {/* DASHBOARD */}
          <MenuItem
            icon={<FaHome />}
            title="Dashboard"
            path="/adminDashboard"
          />

          {/* APP SECTION */}
          <SectionHeader
            title="APP"
            open={openApp}
            toggle={() => setOpenApp(!openApp)}
          />

          {openApp && (
            <ul className={`menu-group ${openApp ? "open" : ""}`}>
              <MenuItem icon={<FaBookOpen />} title="Courses" path="/adminDashboard/courses" />
              <MenuItem icon={<FaUserGraduate />} title="Internships" path="/adminDashboard/internships" />
              <MenuItem icon={<FaCalendarAlt />} title="Events" path="/adminDashboard/events" />
              <MenuItem icon={<FaChalkboardTeacher />} title="Workshops" path="/adminDashboard/workshops" />
            </ul>

          )}

          {/* LEARN SECTION */}
          <SectionHeader
            title="LEARN"
            open={openLearn}
            toggle={() => setOpenLearn(!openLearn)}
          />

          {openLearn && (
            <ul className={`menu-group ${openLearn ? "open" : ""}`}>
              <MenuItem icon={<FaUsers />} title="Students" path="/adminDashboard/students" />
              <MenuItem icon={<FaClipboardList />} title="Assignments" path="/adminDashboard/assignments" />
              <MenuItem icon={<FaVideo />} title="Recording" path="/adminDashboard/recording" />
            </ul>
          )}


          {/* GENERAL SECTION */}
          <SectionHeader
            title="GENERAL"
            open={openGeneral}
            toggle={() => setOpenGeneral(!openGeneral)}
          />

          {openGeneral && (
            <ul className={`menu-group ${openGeneral ? "open" : ""}`}>
              <MenuItem icon={<FaRupeeSign />} title="Finance" path="/adminDashboard/finance" />
              <MenuItem icon={<FaFileInvoice />} title="Documents" path="/adminDashboard/documents" />
              <MenuItem icon={<FaRegBell />} title="Notification" path="/adminDashboard/notification" />
            </ul>
          )}


        </ul>
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer">
        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
