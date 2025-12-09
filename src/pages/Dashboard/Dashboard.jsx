import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ManageStudents from "../Students/ManageStudents";
import Assignments from "../Assignments/ManageAssignments";
import Document from "../Documents/Documents";
import NotFound404 from "../NotFound404/NotFound404";
import "./Dashboard.css";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="admin-container">

      {/* SIDEBAR gets props */}
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* MAIN CONTENT adjusts width */}
      <main className={`admin-content ${collapsed ? "expanded" : ""}`}>
        <Routes>
          <Route path="/" element={<h1 className="welcome-text">Welcome Admin 🎉</h1>} />

          <Route path="students" element={<ManageStudents />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="documents" element={<Document />} />

          {/* INVALID ROUTES */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

    </div>
  );
};

export default Dashboard;
