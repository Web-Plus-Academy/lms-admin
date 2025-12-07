import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "./LogoutButton.css";

const LogoutButton = ({ collapsed }) => {
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminLoginTime");
    window.location.href = "/";
  };

  return (
    <div
      className={`logout-box ${collapsed ? "collapsed" : ""}`}
      onClick={handleLogout}
    >
      <FaSignOutAlt className="logout-icon" />
      {!collapsed && <span>Logout</span>}
    </div>
  );
};

export default LogoutButton;
