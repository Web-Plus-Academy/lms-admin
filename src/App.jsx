import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Dashboard/Dashboard.jsx"; // rename dashboard here
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionWatcher from "./sessionWatcher.js";

// 🔐 ADMIN PROTECTED ROUTE
const AdminProtectedRoute = ({ children }) => {
  const adminId = localStorage.getItem("adminId");
  return adminId ? children : <Navigate to="/" replace />;
};

// 🚫 PUBLIC ROUTE (Don’t show login if admin already logged in)
const PublicRoute = ({ children }) => {
  const adminId = localStorage.getItem("adminId");
  return adminId ? <Navigate to="/adminDashboard" replace /> : children;
};

const App = () => {
  return (
    <>
      <BrowserRouter>

        {/* AUTO LOGOUT SESSION WATCHER */}
        <SessionWatcher />

        <Routes>
          {/* ADMIN LOGIN PAGE */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* ADMIN DASHBOARD PAGE */}
          <Route
            path="/adminDashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* DEFAULT REDIRECT FOR UNKNOWN ROUTES */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
