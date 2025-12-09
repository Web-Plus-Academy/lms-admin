import React, { useState } from "react";
import AssignmentAllocation from "../../components/AssignmentAllocation/AssignmentAllocation.jsx";
import ViewAssignments from "../../components/ViewAssignments/ViewAssignments.jsx";
import GradeAllocation from "../../components/GradeAllocation/GradeAllocation.jsx";
import "../style.css";

const ManageAssignments = () => {
  const [tab, setTab] = useState("allocate");

  const renderTab = () => {
    switch (tab) {
      case "allocate": return <AssignmentAllocation />;
      case "view": return <ViewAssignments />;
      case "edit": return <GradeAllocation />;
      default: return <AssignmentAllocation />;
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">Manage Assignments 📝</h2>

      {/* TAB BAR WITH SLIDING INDICATOR */}
      <div className="tab-nav">

        <div className="tabs">
          <span
            className="tab-indicator"
            style={{
              left:
                tab === "allocate" ? "0%" :
                  tab === "view" ? "33.33%" :
                    "66.66%"
            }}
          />

          <button
            className={tab === "allocate" ? "active" : ""}
            onClick={() => setTab("allocate")}
          >
            ➕ Allocate
          </button>

          <button
            className={tab === "view" ? "active" : ""}
            onClick={() => setTab("view")}
          >
            📚 View
          </button>

          <button
            className={tab === "edit" ? "active" : ""}
            onClick={() => setTab("edit")}
          >
            ✏️ Grading
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

export default ManageAssignments;
