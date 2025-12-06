import React, { useState } from "react";
import {
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import "./Loginfrom.css";
import loginLogo from "../../assets/login-logo.png";

const Loginfrom = ({
  userId,
  password,
  onUserIdChange,
  onPasswordChange,
  onSubmit
}) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="login-card">
      <div className="login-header">
        <img src={loginLogo} alt="Admin Logo" className="login-logo" />
        <h3 className="admin-title">Admin Login</h3>
        <div className="login-line"></div>
      </div>

      {/* ADMIN ID INPUT */}
      <div className="form-group">
        <label>Admin ID</label>
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter admin ID"
            value={userId}
            onChange={onUserIdChange}
          />
          <FaLock className="input-icon" />
        </div>
      </div>

      {/* PASSWORD INPUT */}
      <div className="form-group">
        <label>Password</label>
        <div className="input-box">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter admin password"
            value={password}
            onChange={onPasswordChange}
          />
          {showPass ? (
            <FaEyeSlash
              className="input-icon"
              onClick={() => setShowPass(false)}
            />
          ) : (
            <FaEye className="input-icon" onClick={() => setShowPass(true)} />
          )}
        </div>
      </div>

      {/* LOGIN BUTTON */}
      <button className="login-btn" onClick={onSubmit}>
        Login
      </button>
    </div>
  );
};

export default Loginfrom;
