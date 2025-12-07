import React, { useEffect } from "react";
import "./NotFound404.css";

const NotFound404 = () => {

  useEffect(() => {
    // Auto logout when 404 page loads
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminLoginTime");
  }, []);

  return (
    <div className="notfound-container">
      <h1>404 ❌</h1>
      <p>Page Not Found</p>
      <p>You have been logged out for security reasons.</p>
    </div>
  );
};

export default NotFound404;
