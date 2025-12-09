import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import Loader from "../../components/Loader/Loader"; // ⭐ import loader
import "./AssignmentAllocation.css";

const AssignmentAllocation = () => {
  const [formData, setFormData] = useState({
    course: "",
    batch: "",
    sem: "",
    month: "",
    week: "",
    task: "",
    title: "",
    dueDate: "",
    taskUrl: "",
  });

  const [loading, setLoading] = useState(false); // ⭐ loader state

  // HANDLE INPUT UPDATE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT ASSIGNMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // BASIC VALIDATION
    for (const key in formData) {
      if (!formData[key]) {
        Swal.fire("Missing Fields!", `${key.toUpperCase()} is required`, "warning");
        return;
      }
    }

    try {
      setLoading(true); // ⭐ show loader

      const res = await axios.post(
        `${SERVER_URL}/api/adminAccess/assignTask`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Assignment Allocated 🎉",
        text: res.data.message || "Task has been assigned successfully!",
      });

      // RESET FORM
      setFormData({
        course: "",
        batch: "",
        sem: "",
        month: "",
        week: "",
        task: "",
        title: "",
        dueDate: "",
        taskUrl: "",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Allocate",
        text: err.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false); // ⭐ hide loader
    }
  };

  return (
    <div className="assign-wrapper">
      <h2 className="assign-title">Assignment Allocation 📝</h2>

      {/* ⭐ SHOW LOADER WHEN SENDING REQUEST */}
      {loading && <Loader />}

      <form className={`assign-form ${loading ? "disabled-form" : ""}`} onSubmit={handleSubmit}>

        <div className="assign-field two">
          <label>Course</label>
          <select name="course" value={formData.course} onChange={handleChange} disabled={loading}>
            <option value="">-- Select Course --</option>
            <option value="FS">Full Stack Development</option>
            <option value="FE">Frontend Development</option>
            <option value="BE">Backend Development</option>
          </select>
        </div>

        <div className="assign-field two">
          <label>Batch</label>
          <select name="batch" value={formData.batch} onChange={handleChange} disabled={loading}>
            <option value="">-- Select Batch --</option>
            <option value="1">Batch 1</option>
            <option value="2">Batch 2</option>
            <option value="3">Batch 3</option>
            <option value="4">Batch 4</option>
          </select>
        </div>

        <div className="assign-field one">
          <label>Semester</label>
          <input type="number" name="sem" value={formData.sem} onChange={handleChange} disabled={loading} placeholder="Number" />
        </div>

        <div className="assign-field one">
          <label>Month</label>
          <input type="number" name="month" value={formData.month} onChange={handleChange} disabled={loading} placeholder="Number"/>
        </div>

        <div className="assign-field one">
          <label>Week</label>
          <input type="number" name="week" value={formData.week} onChange={handleChange} disabled={loading} placeholder="Number"/>
        </div>

        <div className="assign-field one">
          <label>Task No.</label>
          <input type="number" name="task" value={formData.task} onChange={handleChange} disabled={loading} placeholder="Number"/>
        </div>

        <div className="assign-field two">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={loading} placeholder="HTML / CSS / JS / ReactJS"/>
        </div>

        <div className="assign-field two">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} disabled={loading} />
        </div>

        <div className="assign-field four">
          <label>Task URL</label>
          <input type="text" name="taskUrl" value={formData.taskUrl} onChange={handleChange} disabled={loading} placeholder="https://..."/>
        </div>

        <button type="submit" className="assign-btn" disabled={loading}>
          {loading ? "Assigning..." : "Allocate Task"}
        </button>
      </form>
    </div>
  );
};

export default AssignmentAllocation;
