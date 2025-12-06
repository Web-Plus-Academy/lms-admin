import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import Loginfrom from "../../components/LoginFrom/Loginfrom";
import Loader from "../../components/Loader/Loader";

const slides = [
  { title: "Admin Panel Access", subtitle: "Manage operations efficiently." },
  { title: "Secure Control", subtitle: "Only authorized personnel can access this panel." },
  { title: "Track & Monitor", subtitle: "Get insights and manage student activities." },
];

export default function Login() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // AUTO-SLIDE EVERY 2 SECONDS
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 🔐 HANDLE ADMIN LOGIN (FRONTEND VALIDATION ONLY)
  const handleLogin = () => {
    if (!adminId || !password) {
      toast.warning("Please enter Admin ID and Password!");
      return;
    }

    setLoading(true);

    // FRONTEND FIXED CREDENTIALS CHECK
    if (adminId == "1" && password == "1") {
      toast.success("Admin Login Successful!");

      // Save admin session
      localStorage.setItem("adminId", adminId);
      localStorage.setItem("adminLoginTime", Date.now());

      setTimeout(() => {
        navigate("/adminDashboard"); // Redirect to admin dashboard
        setLoading(false);
      }, 1500);
    } else {
      toast.error("Invalid Admin Credentials!");
      setLoading(false);
    }
  };

  return (
    <div className="loginpage">
      {loading && <Loader />}

      {/* LEFT PART WITH SLIDER */}
      <div className="leftpart">
        <div className="textslider">
          <h1 className="fade-text">{slides[index].title}</h1>
          <p className="fade-text">{slides[index].subtitle}</p>

          <div className="slider-lines">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`line ${index === i ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PART FORM */}
      <div className="rightpart">
        <div className="loginform">
          <Loginfrom
            userId={adminId}
            password={password}
            onUserIdChange={(e) => setAdminId(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}
