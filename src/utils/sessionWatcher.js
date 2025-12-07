import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SessionWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const expiryTime = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    //const expiryTime = 10 * 1000; // 10 seconds for testing
    const loginTime = Number(localStorage.getItem("adminLoginTime"));

    // Stop if admin not logged in
    if (!loginTime) return;

    const remaining = expiryTime - (Date.now() - loginTime);

    if (remaining <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(logout, remaining);

    function logout() {
      Swal.fire({
        title: "Session Timeout!",
        text: "Your admin session has expired. You will be logged out.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminLoginTime");
        navigate("/", { replace: true });
      });
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

export default SessionWatcher;
