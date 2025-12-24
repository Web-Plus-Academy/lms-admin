import React, { useState } from "react";
import AddInternship from "../../components/AddInternship/AddInternship.jsx";
import ViewInternship from "../../components/ViewInternship/ViewInternship.jsx";
import "../style.css";

const ManageInternships = () => {
        const [tab, setTab] = useState("add");

    return (
        <div className="manage-container">
            <h2 className="title">Manage Internship 🎓</h2>

            <div className="tab-nav">
                <div className="tabs">
                    <span
                        className="tab-indicator"
                        style={{ width:"50%",
                             left: tab === "add" ? "0%" : "50%" }}
                    />

                    <button
                        className={tab === "add" ? "active" : ""}
                        onClick={() => setTab("add")}
                    >
                        ➕ Add Internship
                    </button>

                    <button
                        className={tab === "view" ? "active" : ""}
                        onClick={() => setTab("view")}
                    >
                        📑 View Internship
                    </button>
                </div>
            </div>

            <div className="tab-body slide-container">
                <div key={tab} className="slide-content">
                    {tab === "add" ? <AddInternship /> : <ViewInternship />}
                </div>
            </div>
        </div>
    );
}

export default ManageInternships
