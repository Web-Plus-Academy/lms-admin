import React, { useState } from "react";
import AddWorkshops from "../../components/AddWorkshops/AddWorkshop.jsx";
import ViewWorkshops from "../../components/ViewWorkshops/ViewWorkshop.jsx";
import "../style.css";

const ManageWorkshops = () => {
         const [tab, setTab] = useState("add");

    return (
        <div className="manage-container">
            <h2 className="title">Manage Workshops 🎓</h2>

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
                        ➕ Add Workshops
                    </button>

                    <button
                        className={tab === "view" ? "active" : ""}
                        onClick={() => setTab("view")}
                    >
                        📑 View Workshops
                    </button>
                </div>
            </div>

            <div className="tab-body slide-container">
                <div key={tab} className="slide-content">
                    {tab === "add" ? <AddWorkshops /> : <ViewWorkshops />}
                </div>
            </div>
        </div>
    );
}

export default ManageWorkshops
