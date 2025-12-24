import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardComponent.css";
import RevenueChart from "./RevenueChart.jsx";
import EnrollmentChart from "./EnrollmentChart.jsx";
import RecentActivity from "./RecentActivity.jsx";
import NotificationsPanel from "./NotificationsPanel.jsx";

const DashboardComponent = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Courses",
      desc: "Manage all courses",
      path: "/adminDashboard/courses",
      icon: "📚",
      color: "blue",
    },
    {
      title: "Internships",
      desc: "Paid / Stipend / Unpaid",
      path: "/adminDashboard/internships",
      icon: "💼",
      color: "green",
    },
    {
      title: "Events",
      desc: "Webinars & Conferences",
      path: "/adminDashboard/events",
      icon: "📅",
      color: "purple",
    },
    {
      title: "Workshops",
      desc: "Hands-on sessions",
      path: "/adminDashboard/workshops",
      icon: "🛠️",
      color: "orange",
    },
    {
      title: "Students",
      desc: "Enrolled learners",
      path: "/adminDashboard/students",
      icon: "🎓",
      color: "cyan",
    },
    {
      title: "Finance",
      desc: "Payments & revenue",
      path: "/adminDashboard/finance",
      icon: "₹",
      color: "red",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview & quick actions</p>
      </div>

      {/* STATS */}
      <div className="admin-stats-grid">
        <StatCard label="Total Courses" value="12" />
        <StatCard label="Active Internships" value="8" />
        <StatCard label="Upcoming Events" value="5" />
        <StatCard label="Workshops" value="6" />
        <StatCard label="Students" value="420+" />
        <StatCard label="Revenue" value="₹2.4L" />
      </div>

      {/* QUICK ACCESS */}
      <h2 className="admin-section-title">Quick Access</h2>

      <div className="admin-quick-grid">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`admin-quick-card ${c.color}`}
            onClick={() => navigate(c.path)}
          >
            <div className="admin-quick-icon">{c.icon}</div>
            <div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="admin-dashboard-charts">
        <RevenueChart />
        <EnrollmentChart />
      </div>

      {/* LOWER SECTION */}
      <div className="admin-dashboard-bottom">
        <RecentActivity />
        <NotificationsPanel />
      </div>

    </div>
  );
};

export default DashboardComponent;

/* ===== STAT CARD ===== */
const StatCard = ({ label, value }) => (
  <div className="admin-stat-card">
    <p className="admin-stat-label">{label}</p>
    <h3 className="admin-stat-value">{value}</h3>
  </div>
);
