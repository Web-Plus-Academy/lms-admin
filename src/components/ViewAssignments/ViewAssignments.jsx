import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/Loader";
import SERVER_URL from "../../config/backendUrl";
import EditTask from "../EditTask/EditTask";
import "./ViewAssignments.css";

const ViewAssignments = () => {
    const [batch, setBatch] = useState("");
    const [course, setCourse] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    // EDIT POPUP STATE
    const [editModal, setEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // FILTERS
    const [filterSem, setFilterSem] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterWeek, setFilterWeek] = useState("");

    // FETCH ALL TASKS
    const fetchTasks = async () => {
        if (!batch || !course) {
            Swal.fire("Missing Filters", "Select Course & Batch", "warning");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${SERVER_URL}/api/adminAccess/getTasks/${batch}/${course}`);

            if (!res.data.success) {
                Swal.fire("No Tasks!", res.data.message, "info");
                return;
            }

            setAssignments(res.data.assignments);
        } catch {
            Swal.fire("Error", "Failed to load tasks", "error");
            assignments.length = 0;
        } finally {
            setLoading(false);
        }
    };

    // OPEN EDIT MODAL
    const openEditPopup = (task, sem, month, week) => {
        setSelectedTask({
            course,
            batch,
            sem,
            month,
            week,
            task: task.task,
            title: task.title,
            dueDate: task.dueDate?.split("T")[0],
            taskUrl: task.taskUrl,
        });
        setEditModal(true);
    };

    // DELETE TASK
    const deleteTask = async (sem, month, week, taskNo) => {
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: `Delete Task ${taskNo}?`,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (res) => {
            if (!res.isConfirmed) return;

            try {
                setLoading(true);
                const response = await axios.delete(
                    `${SERVER_URL}/api/adminAccess/task/${batch}/${course}/${sem}/${month}/${week}/${taskNo}`
                );
                Swal.fire("Deleted!", response.data.message, "success");
                fetchTasks();
            } catch (err) {
                Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
            } finally {
                setLoading(false);
            }
        });
    };

    // LOCK SEMESTER
    const lockSemester = async (sem) => {
        Swal.fire({
            icon: "question",
            title: `Lock Semester ${sem}?`,
            text: "All tasks will become non-editable",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            confirmButtonText: "Lock",
        }).then(async (res) => {
            if (!res.isConfirmed) return;

            try {
                setLoading(true);
                const lockRes = await axios.put(
                    `${SERVER_URL}/api/adminAccess/semLock/${batch}/${course}/${sem}`
                );

                Swal.fire("Locked!", lockRes.data.message, "success");
                fetchTasks();
            } catch {
                Swal.fire("Error", "Lock failed", "error");
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="view-assign-container">
            <h2 className="heading">View Assignments</h2>
            <div className="nav-bar">



                {/* MAIN FILTERS */}
                <div className="filter-row-left">
                    <select value={course} onChange={(e) => setCourse(e.target.value)}>
                        <option value=""> -- Select Course -- </option>
                        <option value="FS">Full Stack Development</option>
                        <option value="FE">Frontend Development</option>
                        <option value="BE">Backend Development</option>
                    </select>

                    {/* <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Select Batch</option>
          <option value="1">Batch 1</option>
          <option value="2">Batch 2</option>
          <option value="3">Batch 3</option>
          <option value="4">Batch 4</option>
        </select> */}

                    <div>
                        <label>Batch - </label>
                        <input type="number" placeholder="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
                    </div>

                    <button className="fetch-btn" onClick={fetchTasks}>Fetch</button>
                </div>

                {/* SUB FILTERS */}
                {/* {assignments.length > 0 && (
        
      )} */}

                <div className="filter-row-right">
                    S<input type="number" placeholder="Sem" value={filterSem} onChange={(e) => setFilterSem(e.target.value)} />
                    M<input type="number" placeholder="Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
                    W<input type="number" placeholder="Week" value={filterWeek} onChange={(e) => setFilterWeek(e.target.value)} />
                </div>

            </div>

            {loading && <Loader />}

            {/* DISPLAY HIERARCHY */}
            {!loading && assignments.length > 0 &&
                assignments
                    .filter(s => !filterSem || s.sem == filterSem)
                    .map((sem, si) => (
                        <div key={si} className="sem-card">

                            <div className="sem-header">
                                <h2>Semester {sem.sem}</h2>
                                <button className="lock-btn" onClick={() => lockSemester(sem.sem)}>Lock</button>
                            </div>

                            {sem.months
                                .filter(m => !filterMonth || m.month == filterMonth)
                                .map((month, mi) => (
                                    <div key={mi} className="month-card">
                                        <h3>Month {month.month}</h3>

                                        {month.weeks
                                            .filter(w => !filterWeek || w.week == filterWeek)
                                            .map((week, wi) => (
                                                <div key={wi} className="week-block">
                                                    <p className="week-title">Week {week.week}</p>

                                                    <div className="task-grid">
                                                        {week.tasks.map((task, ti) => (
                                                            <div key={ti} className="task-card">

                                                                <p className="task-title">Task {task.task}: {task.title}</p>
                                                                <p><strong>Allocated:</strong> {new Date(task.allocatedOn).toLocaleDateString()}</p>
                                                                <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

                                                                <a href={task.taskUrl} target="_blank" rel="noreferrer">📎 Task Link</a>

                                                                <div className="task-actions">

                                                                    {/* EDIT BUTTON BLOCKED IF TASK LOCKED */}
                                                                    {task.status === "Locked" ? (
                                                                        <button className="locked-btn" disabled>🔒 Locked</button>
                                                                    ) : (
                                                                        <button
                                                                            className="edit-btn"
                                                                            onClick={() => openEditPopup(task, sem.sem, month.month, week.week)}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    )}

                                                                    {/* DELETE BUTTON BLOCKED IF LOCKED */}
                                                                    {/* {task.status === "Locked" ? (
                                    <button className="locked-btn" disabled>Delete</button>
                                  ) : (

                                  
                                  <button
                                      className="delete-btn"
                                      onClick={() => deleteTask(sem.sem, month.month, week.week, task.task)}
                                    >
                                      Delete
                                    </button>
                                    
                                  )} */}


                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={() => deleteTask(sem.sem, month.month, week.week, task.task)}
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                        </div>
                    ))
            }

            {/* NO RESULTS AFTER FILTERING */}
            {!loading && assignments.length > 0 &&
                assignments
                    .filter(s => !filterSem || s.sem == filterSem)
                    .every(sem =>
                        sem.months
                            .filter(m => !filterMonth || m.month == filterMonth)
                            .every(month =>
                                month.weeks
                                    .filter(w => !filterWeek || w.week == filterWeek)
                                    .every(week => week.tasks.length === 0)
                            )
                    ) && (
                    <div className="no-results-box">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png"
                            alt="No Results"
                            className="no-img"
                        />
                        <h3>No Assignments Found 📭</h3>
                        <p>Try selecting a different Semester, Month, or Week filter.</p>
                    </div>
                )}



            {/* EDIT POPUP */}
            {editModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <EditTask oldData={selectedTask} closeModal={() => setEditModal(false)} refreshTasks={fetchTasks} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAssignments;
