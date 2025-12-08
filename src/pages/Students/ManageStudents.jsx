import React, { useState } from "react";
import AddStudent from "../../components/AddStudent/AddStudent.jsx";
import ViewStudents from "../../components/ViewStudents/ViewStudents.jsx";
import StudentProgress from "../../components/StudentProgress/StudentProgress.jsx";
import "./ManageStudents.css";

const ManageStudents = () => {
  const [tab, setTab] = useState("add");

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = "/ApplicationForm.pdf"; // path to your PDF
    link.download = "Student_Application_Form.pdf";
    link.click();
  };

  const downloadPdf1 = () => {
    const link = document.createElement("a");
    link.href = "/T&Cforrm.pdf"; // path to your PDF
    link.download = "Course_T&C_Form.pdf";
    link.click();
  };


  const renderTab = () => {
    switch (tab) {
      case "add": return <AddStudent />;
      case "view": return <ViewStudents />;
      case "edit": return <StudentProgress />;
      default: return <AddStudent />;
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">Manage Students 📚</h2>

      {/* NAVBAR TABS */}
      <div className="tab-nav">

        <div className="left-nav">

          <button className={tab === "add" ? "active" : ""} onClick={() => setTab("add")}>
            ➕ Add Student
          </button>

          <button className={tab === "view" ? "active" : ""} onClick={() => setTab("view")}>
            👁️ View Students
          </button>

          <button className={tab === "edit" ? "active" : ""} onClick={() => setTab("edit")}>
            📈 Student Progress
          </button>

        </div>

        <div className="right-nav">

          <button className="download-btn" onClick={downloadPdf}>
            📄 Download Application Form
          </button>

          <button className="download-btn-1" onClick={downloadPdf1}>
            📄 Download T&C Form
          </button>

        </div>

      </div>

      {/* RENDER SELECTED COMPONENT */}
      <div className="tab-body">{renderTab()}</div>
    </div>
  );
};

export default ManageStudents;
