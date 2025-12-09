import React, { useState } from "react";
import AddStudent from "../../components/AddStudent/AddStudent.jsx";
import ViewStudents from "../../components/ViewStudents/ViewStudents.jsx";
import StudentProgress from "../../components/StudentProgress/StudentProgress.jsx";
import "../style.css";

const ManageStudents = () => {
  const [tab, setTab] = useState("add");

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = "/ApplicationForm.pdf";
    link.download = "Student_Application_Form.pdf";
    link.click();
  };

  const downloadPdf1 = () => {
    const link = document.createElement("a");
    link.href = "/T&Cforrm.pdf";
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

      {/* TABS + DOWNLOAD BUTTONS */}
      <div className="tab-nav">

        {/* TAB SECTION WITH SLIDING INDICATOR */}
        <div className="tabs">
          <span
            className="tab-indicator"
            style={{
              left: tab === "add" ? "0%" :
                    tab === "view" ? "33.33%" : "66.66%"
            }}
          />

          <button className={tab === "add" ? "active" : ""}
            onClick={() => setTab("add")}>
            ➕ Register
          </button>

          <button className={tab === "view" ? "active" : ""}
            onClick={() => setTab("view")}>
            📑 View 
          </button>

          <button className={tab === "edit" ? "active" : ""}
            onClick={() => setTab("edit")}>
            📈 Progress
          </button>
        </div>

        {/* RIGHT SIDE DOWNLOADS */}
        <div className="right-nav">
          <button className="download-btn" onClick={downloadPdf}>
            📄 Application Form
          </button>
          <button className="download-btn-1" onClick={downloadPdf1}>
            📄 Terms & Conditions
          </button>
        </div>

      </div>

      {/* TAB CONTENT */}
      <div className="tab-body slide-container">
        <div key={tab} className="slide-content">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
