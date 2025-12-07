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
  const [students, setStudents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  // FETCH STUDENTS BY BATCH
  const fetchStudents = async () => {
    if (!batch) {
      Swal.fire("Select Batch!", "Please choose a batch first", "warning");
      return;
    }

    setLoader(true);
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/adminAccess/getStudentsByBatch/${batch}`
      );

      const data = res.data.students || res.data.data || [];

      if (!res.data.success || data.length === 0) {
        setStudents([]);
        setFilteredData([]);
        Swal.fire({
          icon: "info",
          title: "No Data Found",
          text: res.data.message || `Batch ${batch} has no students.`,
        });
        return;
      }

      setStudents(data);
      setFilteredData(data);

      Swal.fire({
        icon: "success",
        title: "Batch Loaded",
        text: `Fetched ${data.length} students from Batch ${batch}`,
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

  // SEARCH FILTER
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = students.filter(
      (std) =>
        std.userId.toLowerCase().includes(val) ||
        std.fullName.toLowerCase().includes(val) ||
        std.email.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, students]);

  return (
    <div className="students-container">
      <h2 className="heading">View Students</h2>

      {/* FILTER SECTION */}
      <div className="top-bar">
        <div className="left-top-bar">
          <label>Batch</label>
          <select value={batch} onChange={(e) => setBatch(e.target.value)}>
            <option value="">-- Select Batch --</option>
            <option value="1">FSB1</option>
            <option value="2">FSB2</option>
            <option value="3">FSB3</option>
            <option value="4">FSB4</option>
          </select>

          <button className="fetch-btn" onClick={fetchStudents}>Fetch</button>
          <span>
            <span className="star">Note:</span> Click fetch after edit!
          </span>
        </div>

        <input
          type="text"
          placeholder="Search by Name, Email, UserID... 🔍"
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loader && <Loader />}

      {/* TABLE */}
      {!loader && filteredData.length > 0 && (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>View / Edit</th>
              </tr>
            </thead>
          </table>

          {/* SCROLLABLE BODY */}
          <div className="table-body-scroll">
            <table className="students-table body-table">
              <tbody>
                {filteredData.map((std) => (
                  <tr key={std._id}>
                    <td>{std.userId}</td>
                    <td>{std.fullName}</td>
                    <td>{std.email}</td>
                    <td>{std.phone}</td>
                    <td className="action-buttons">
                      <button className="view-btn" onClick={() => setSelectedStudent(std)}>View</button>
                      <button className="edit-btn" onClick={() => setEditStudent(std)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NO DATA */}
      {!loader && filteredData.length === 0 && (
        <p className="no-data">No students found ❌</p>
      )}

      {/* PROFILE MODAL */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* EDIT MODAL */}
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
