import React, { useState } from "react";
import AddStudent from "../../components/AddStudent/AddStudent.jsx";
import ViewStudents from "../../components/ViewStudents/ViewStudents.jsx";
import EditStudent from "../../components/EditStudent/EditStudent.jsx";
import "./ManageStudents.css";

const ManageStudents = () => {
  const [tab, setTab] = useState("add");

  const renderTab = () => {
    switch (tab) {
      case "add": return <AddStudent />;
      case "view": return <ViewStudents />;
      case "edit": return <EditStudent />;
      default: return <AddStudent />;
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">Manage Students 📚</h2>

      {/* NAVBAR TABS */}
      <div className="tab-nav">
        <button className={tab === "add" ? "active" : ""} onClick={() => setTab("add")}>
          ➕ Add Student
        </button>

        <button className={tab === "view" ? "active" : ""} onClick={() => setTab("view")}>
          👁️ View Students
        </button>

        <button className={tab === "edit" ? "active" : ""} onClick={() => setTab("edit")}>
          ✏️ Edit / Update
        </button>
      </div>

      {/* RENDER SELECTED COMPONENT */}
      <div className="tab-body">{renderTab()}</div>
    </div>
  );
};

export default ManageStudents;
