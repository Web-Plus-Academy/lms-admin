import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardComponent from "../../components/Dashboard/DashboardComponent.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import ManageCourses from "../Courses/ManageCourses.jsx";
import ManageInternships from "../Internships/ManageInternships.jsx";
import ManageEvents from "../Events/ManageEvents.jsx";
import ManageWorkshops from "../Workshops/ManageWorkshops.jsx";
import ManageStudents from "../Students/ManageStudents";
import Assignments from "../Assignments/ManageAssignments";
import Document from "../Documents/Documents";
// import NotFound404 from "../NotFound404/NotFound404";
import "./Dashboard.css";
import FinancialManagement from "../Financial/FinanceManagement";
import NotificationSender from "../NotificationManagement/NotificationManagement";
import RecordingManagement from "../Recordings/RecordingManagement";

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
          <Route path="/" element={<DashboardComponent/>} />

          <Route path="courses" element={<ManageCourses />} />
          <Route path="internships" element={<ManageInternships />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="workshops" element={<ManageWorkshops />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="documents" element={<Document />} />
          <Route path="finance" element={<FinancialManagement />} />
          <Route path="notification" element={<NotificationSender />} />
          <Route path="recording" element={<RecordingManagement />} />

          {/* INVALID ROUTES */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

    </div>
  );
};

export default Dashboard;
