import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaUserEdit } from "react-icons/fa";
import "./EditStudentModal.css";
import axios from "axios";
import SERVER_URL from "../../config/backendUrl";
import { toast } from "react-toastify";

const EditStudentModal = ({ student, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    avatar: "",
    phone: "",
    secondaryPhone: "",
    courseName: "",
    currentWeek: "",
    currentMonth: "",
    currentSem: "",
    address: {
      doorNo: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    }
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName ?? "",
        email: student.email ?? "",
        password: student.password ?? "",
        dob: student.dob ? student.dob.substring(0, 10) : "",
        gender: student.gender ?? "",
        avatar: student.avatar ?? "",
        phone: student.phone ?? "",
        secondaryPhone: student.secondaryPhone ?? "",
        courseName: student.courseName ?? "",
        currentWeek: student.currentWeek ?? "",
        currentMonth: student.currentMonth ?? "",
        currentSem: student.currentSem ?? "",
        
        address: {
          doorNo: student.address?.doorNo ?? "",
          street: student.address?.street ?? "",
          city: student.address?.city ?? "",
          state: student.address?.state ?? "",
          pincode: student.address?.pincode ?? "",
        }
      });
    }
  }, [student]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // SUBMIT UPDATED DATA
  const handleSave = async () => {
  try {
    await axios.put(
      `${SERVER_URL}/api/adminAccess/updateProfile/${student.userId}`,
      formData
    );

    toast.success("Student updated successfully!");

    // CLOSE MODAL AFTER TOAST
    setTimeout(() => {
      onClose();   // close edit modal
      onUpdated(); // refresh table safely
    }, 600);

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed!");
  }
};



  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>

        <button className="edit-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="edit-header">
          <FaUserEdit className="edit-icon" />
          <h2>Edit Student Details</h2>
          <p>User ID: {student.userId}</p>
        </div>

        <div className="edit-form-grid">

          <div className="edit-field">
            <label>Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Password</label>
            <input name="password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>DOB</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Secondary Phone</label>
            <input name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="edit-field full">
            <label>Avatar URL</label>
            <input name="avatar" value={formData.avatar} onChange={handleChange} />
          </div>

          <h3 className="section-title">Address Details</h3>

          <div className="edit-field">
            <label>Door No</label>
            <input name="address.doorNo" value={formData.address.doorNo} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Street</label>
            <input name="address.street" value={formData.address.street} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>City</label>
            <input name="address.city" value={formData.address.city} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>State</label>
            <input name="address.state" value={formData.address.state} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Pincode</label>
            <input name="address.pincode" value={formData.address.pincode} onChange={handleChange} />
          </div>

          <h3 className="section-title">Course Info</h3>

          <div className="edit-field">
            <label>Course Name</label>
            <input name="courseName" value={formData.courseName} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Current Week</label>
            <input name="currentWeek" value={formData.currentWeek} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Current Month</label>
            <input name="currentMonth" value={formData.currentMonth} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Current Sem</label>
            <input name="currentSem" value={formData.currentSem} onChange={handleChange} />
          </div>

        </div>

        <div className="edit-buttons">
          <button className="edit-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="edit-save-btn" onClick={handleSave}>
            <FaSave /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditStudentModal;
