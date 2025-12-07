import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import ManageStudents from "../Students/ManageStudents";
import Assignments from "../Assignments/Assignments";
import NotFound404 from "../NotFound404/NotFound404"; // import 404
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <main className="admin-content">
        <Routes>
          {/* DEFAULT DASHBOARD LANDING */}
          <Route path="/" element={<h1 className="welcome-text">Welcome Admin 🎉</h1>} />

          {/* STUDENTS PAGE */}
          <Route path="students" element={<ManageStudents />} />

          {/* ASSIGNMENTS PAGE */}
          <Route path="assignments" element={<Assignments />} />


          {/* 🛑 WRONG CHILD ROUTE CATCHER */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

      </main>
    </div>
  );
};

export default Dashboard;
