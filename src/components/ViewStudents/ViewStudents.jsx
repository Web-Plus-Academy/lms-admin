import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import Loader from "../../components/Loader/Loader";
import StudentProfileModal from "../../components/StudentProfileModal/StudentProfileModal";
import EditStudentModal from "../EditStudentModal/EditStudentModal";
import "./ViewStudents.css";

const ViewStudents = () => {
  const [batch, setBatch] = useState("");
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  // Avatar fallback generator
  const createInitialAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);

    const div = document.createElement("div");
    div.className = "initial-avatar";
    div.innerText = initials;
    return div;
  };

  // FETCH STUDENTS
  const fetchStudents = async () => {
    if (!batch) return Swal.fire("Select Batch!", "Please choose a batch first", "warning");
    if (!course) return Swal.fire("Select Course!", "Please choose a course first", "warning");

    setLoader(true);
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/adminAccess/getStudentsByBatch/${batch}/${course}`
      );

      const data = res.data.students || res.data.data || [];

      if (!res.data.success || data.length === 0) {
        setStudents([]);
        setFilteredData([]);
        return Swal.fire({
          icon: "info",
          title: "No Data Found",
          text: res.data.message || `${course}B${batch} has no students.`,
        });
      }

      setStudents(data);
      setFilteredData(data);

      Swal.fire({
        icon: "success",
        title: "Batch Loaded",
        text: `Fetched ${data.length} students from ${course}B${batch}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server / Internet Error",
        text: "Unable to fetch students. Please check your network.",
      });
      setStudents([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  };

  // SEARCH & STATUS FILTER
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = students.filter((std) => {
      const searchMatch =
        std.userId.toLowerCase().includes(val) ||
        std.fullName.toLowerCase().includes(val) ||
        std.email.toLowerCase().includes(val);

      const statusMatch = statusFilter ? std.status === statusFilter : true;
      return searchMatch && statusMatch;
    });

    setFilteredData(filtered);
  }, [search, statusFilter, students]);

  return (
    <div className="students-container">
      <h2 className="heading">View Students</h2>

      {/* FILTER BAR */}
      <div className="top-bar">
        <div className="left-top-bar">
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">-- Select Course --</option>
            <option value="FS">Full Stack Development</option>
            <option value="FE">Frontend Development</option>
            <option value="BE">Backend Development</option>
          </select>

          <select value={batch} onChange={(e) => setBatch(e.target.value)}>
            <option value="">-- Select Batch --</option>
            <option value="1">Batch-1</option>
            <option value="2">Batch-2</option>
            <option value="3">Batch-3</option>
            <option value="4">Batch-4</option>
          </select>

          <button className="fetch-btn" onClick={fetchStudents}>Fetch</button>
        </div>

        <div className="filter-right">
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Online</option>
            <option value="inactive">Offline</option>
            <option value="blocked">Blocked</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Search by Name, Email, UserID ..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loader && <Loader />}

      {/* TABLE */}
      {!loader && filteredData.length > 0 && (
        <>
          <div className="students-header">
            <div className="student-info-col">Student</div>
            <div className="userid-col">User ID</div>
            <div className="phone-col">Phone</div>
            <div className="login-col">Last Login</div>
            <div className="status-col">Status</div>
            <div className="actions-col">Actions</div>
          </div>

          <div className="students-list">
            {filteredData.map((std) => (
              <div className="student-row" key={std._id}>

                {/* PROFILE SECTION WITH FALLBACK */}
                <div className="student-info">
                  <img
                    src={std.avatar}
                    alt={std.fullName}
                    className="avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.replaceWith(createInitialAvatar(std.fullName));
                    }}
                  />

                  <div className="name-email">
                    <h4>{std.fullName}</h4>
                    <span>{std.email}</span>
                  </div>
                </div>

                <div className="userid-col"><span>{std.userId}</span></div>
                <div className="phone-col"><span>{std.phone}</span></div>

                <div className="login-col-time">
                  {std.lastLogin ? new Date(std.lastLogin).toLocaleString() : "Never"}
                </div>

                <div className="status-col">
                  <span className={`status ${std.status}`}>
                    {std.status === "active" && "🟢 Online"}
                    {std.status === "inactive" && "⚪ Offline"}
                    {std.status === "blocked" && "🔴 Blocked"}
                  </span>
                </div>

                <div className="actions">
                  <button className="view-btn" onClick={() => setSelectedStudent(std)}>View</button>

                  <button
                    className={`edit-btn ${std.status === "blocked" ? "disabled-btn" : ""}`}
                    onClick={() => std.status !== "blocked" && setEditStudent(std)}
                    disabled={std.status === "blocked"}
                  >
                    Edit
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {!loader && filteredData.length === 0 && (
        <p className="no-data">No students found ❌</p>
      )}

      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {editStudent && (
        <EditStudentModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onUpdated={fetchStudents}
        />
      )}
    </div>
  );
};

export default ViewStudents;
