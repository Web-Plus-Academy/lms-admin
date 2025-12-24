import React, { useState } from "react";
import AddEvents from "../../components/AddEvents/AddEvent.jsx";
import ViewEvents from "../../components/ViewEvents/ViewEvent.jsx";
import "../style.css";

const ManageEvents = () => {
    const [tab, setTab] = useState("add");

    return (
        <div className="manage-container">
            <h2 className="title">Manage Events 🗓️</h2>

            <div className="tab-nav">
                <div className="tabs">
                    <span
                        className="tab-indicator"
                        style={{
                            width: "50%",
                            left: tab === "add" ? "0%" : "50%"
                        }}
                    />

                    <button
                        className={tab === "add" ? "active" : ""}
                        onClick={() => setTab("add")}
                    >
                        ➕ Add Events
                    </button>

                    <button
                        className={tab === "view" ? "active" : ""}
                        onClick={() => setTab("view")}
                    >
                        📑 View Events
                    </button>
                </div>
            </div>

            <div className="tab-body slide-container">
                <div key={tab} className="slide-content">
                    {tab === "add" ? <AddEvents /> : <ViewEvents />}
                </div>
            </div>
        </div>
    );
}

export default ManageEvents
