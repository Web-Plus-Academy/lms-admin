import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionWatcher from "./sessionWatcher.js";

// PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/" replace />;
};

// PUBLIC ROUTE
const PublicRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  return userId ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <>
      <BrowserRouter>

        {/* SESSION WATCHER THAT AUTO-LOGOUTS */}
        <SessionWatcher />

        <Routes>
          {/* LOGIN PAGE */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* DASHBOARD PAGE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
};

export default App;
