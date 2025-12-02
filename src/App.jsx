import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

// React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/" element={<Login />} />

          {/* PROTECTED ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* TOAST NOTIFICATION GLOBAL SETUP */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
