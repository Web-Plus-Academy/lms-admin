import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Dashboard/Dashboard.jsx";
import NotFound404 from "./pages/NotFound404/NotFound404.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionWatcher from "./utils/sessionWatcher.js";

// 🔐 ADMIN PROTECTED ROUTE
const AdminProtectedRoute = ({ children }) => {
  const adminId = localStorage.getItem("adminId");
  return adminId ? children : <Navigate to="/" replace />;
};

// 🚫 PUBLIC ROUTE
const PublicRoute = ({ children }) => {
  const adminId = localStorage.getItem("adminId");
  return adminId ? <Navigate to="/adminDashboard" replace /> : children;
};

// ❌ HANDLE WRONG ROUTES AND FORCE LOGOUT
const LogoutAndRedirect404 = () => {
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminLoginTime");
  return <Navigate to="/404" replace />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <SessionWatcher />

        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/adminDashboard/*"
            element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}
          />

          {/* 404 PAGE */}
          <Route path="/404" element={<NotFound404 />} />

          {/* INVALID ROUTES -> LOGOUT + REDIRECT TO 404 */}
          <Route path="*" element={<LogoutAndRedirect404 />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2500} pauseOnHover theme="colored" />
    </>
  );
};

export default App;
