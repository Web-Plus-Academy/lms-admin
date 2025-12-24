import React, { useState } from "react";
import AddCourse from "../../components/AddCourses/AddCourse.jsx";
import ViewCourses from "../../components/ViewCourses/ViewCourses.jsx";
import "../style.css";

const ManageCourses = () => {
    const [tab, setTab] = useState("add");

    return (
        <div className="manage-container">
            <h2 className="title">Manage Courses 🎓</h2>

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
                        ➕ Add Course
                    </button>

                    <button
                        className={tab === "view" ? "active" : ""}
                        onClick={() => setTab("view")}
                    >
                        📑 View Courses
                    </button>
                </div>
            </div>

            <div className="tab-body slide-container">
                <div key={tab} className="slide-content">
                    {tab === "add" ? <AddCourse /> : <ViewCourses />}
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
