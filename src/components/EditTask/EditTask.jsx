import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/Loader";
import SERVER_URL from "../../config/backendUrl";
import "./EditTask.css";

const EditTask = ({ oldData, closeModal, refreshTasks }) => {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (oldData) {
      setFormData({
        course: oldData.course,
        batch: oldData.batch,
        sem: oldData.sem,
        month: oldData.month,
        week: oldData.week,
        task: oldData.task,
        title: oldData.title,
        dueDate: oldData.dueDate ? oldData.dueDate.split("T")[0] : "",
        taskUrl: oldData.taskUrl,
      });
    }
  }, [oldData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`${SERVER_URL}/api/adminAccess/editTask`, formData);

      Swal.fire({
        icon: "success",
        title: "Task Updated 🎉",
        text: res.data.message,
      });

      setTimeout(() => {
        closeModal();
        refreshTasks()// refresh assignment table
      }, 600);
      

    } catch (err) {
      Swal.fire("Error Updating Task", err.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-task-container">
      <form className="edit-task-form" onSubmit={handleSubmit}>
        <h2 className="edit-heading">Edit Task</h2>
        <button type="button" className="close-btn" onClick={closeModal}>
          ❌
        </button>

        {loading && <Loader />}

        {/* COURSE & BATCH (LOCKED) */}
        <div className="edit-row">
          <div>
            {/* <label>Course: </label> */}
            {formData.course}
          </div>

          <div>
            <label>Batch-</label>
            {formData.batch}
          </div>
     

        {/* SEM, MONTH, WEEK, TASK (LOCKED) */}
        
          <div>
            <label>SEM</label>
            {formData.sem}
          </div>

          <div>
            <label>M</label>
            {formData.month}
          </div>

          <div>
            <label>W</label>
            {formData.week}
          </div>

          <div>
            <label>Task-</label>
            {formData.task}
          </div>
        </div>

        {/* EDITABLE FIELDS */}
        <label>Task Title</label>
        <input
          type="text"
          className="wide"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Due Date</label>
        <input
          type="date"
          className="wide"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <label>Task URL</label>
        <input
          type="text"
          className="wide"
          name="taskUrl"
          value={formData.taskUrl}
          onChange={handleChange}
        />

        <button className="edit-task-btn">Update Task 🚀</button>
      </form>
    </div>
  );
};

export default EditTask;
