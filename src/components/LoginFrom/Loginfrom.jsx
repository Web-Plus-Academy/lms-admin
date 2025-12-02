import React, { useState } from "react";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaFacebook
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
        <img src={loginLogo} alt="SWPA Logo" className="login-logo" />
        <div className="login-line"></div>
      </div>

      <div className="form-group">
        <label>User ID</label>
        <div className="input-box">
          <input
            type="text"
            placeholder="enter user id"
            value={userId}
            onChange={onUserIdChange} // 🔁 send value to parent
          />
          <FaLock className="input-icon" />
        </div>
      </div>

      <div className="form-group">
        <label>Password</label>
        <div className="input-box">
          <input
            type={showPass ? "text" : "password"}
            placeholder="enter password"
            value={password}
            onChange={onPasswordChange} // 🔁 send value to parent
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

      {/* SOCIAL ICONS */}
      <div className="social-icons">
        <FaInstagram />
        <FaLinkedin />
        <FaGlobe />
        <FaFacebook />
      </div>
    </div>
  );
};

export default Loginfrom;
