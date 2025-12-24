import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./EditCourseModal.css";

const EditCourseModal = ({ course, close, refresh }) => {
  const [data, setData] = useState(course);
  const [saving, setSaving] = useState(false);

  /* =========================
     FREEZE BACKGROUND SCROLL
  ========================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     SAVE COURSE (SWAL)
  ========================= */
  const save = async () => {
    try {
      setSaving(true);

      const payload = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        instructor: data.instructor,
        image: data.image,
        category: data.category,
        rating: Number(data.rating),
        students: Number(data.students),
        startDate: data.startDate,
        enrollClose: data.enrollClose,
        isPaid: data.isPaid,
        price: data.isPaid ? Number(data.price) : 0,
      };

      await axios.put(
        `${SERVER_URL}/api/app-admin/courses/${course._id}`,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Course updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      refresh();
      close();
    } catch (err) {
      console.error("Update failed", err);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Unable to update course. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="admin-editcourse-overlay">
    <div className="admin-editcourse-card">

      {/* HEADER */}
      <div className="admin-editcourse-header">
        <h3 className="admin-editcourse-title">Edit Course</h3>

        <button
          className="admin-editcourse-close"
          onClick={() => {
            Swal.fire({
              title: "Discard changes?",
              text: "Any unsaved changes will be lost",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Discard",
              cancelButtonText: "Continue Editing",
            }).then((res) => {
              if (res.isConfirmed) close();
            });
          }}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="admin-editcourse-body">

        <div className="admin-editcourse-grid">
          <EditCourseField label="Title" name="title" value={data.title} onChange={handleChange} />
          <EditCourseField label="Instructor" name="instructor" value={data.instructor} onChange={handleChange} />
          <EditCourseField label="Duration" name="duration" value={data.duration} onChange={handleChange} />
          <EditCourseField label="Category" name="category" value={data.category} onChange={handleChange} />
          <EditCourseField label="Image URL" name="image" value={data.image} onChange={handleChange} />
          <EditCourseField label="Rating" name="rating" type="number" value={data.rating} onChange={handleChange} />
          <EditCourseField label="Students" name="students" type="number" value={data.students} onChange={handleChange} />

          <EditCourseField
            label="Start Date"
            name="startDate"
            type="date"
            value={data.startDate?.slice(0, 10)}
            onChange={handleChange}
          />

          <EditCourseField
            label="Enroll Close"
            name="enrollClose"
            type="date"
            value={data.enrollClose?.slice(0, 10)}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="admin-editcourse-section">
          <label className="admin-editcourse-label">Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className="admin-editcourse-textarea"
          />
        </div>

        {/* PAID INLINE */}
        <div className="admin-editcourse-paid-row">
          <label className="admin-editcourse-checkbox">
            <input
              type="checkbox"
              name="isPaid"
              checked={data.isPaid}
              onChange={handleChange}
            />
            Paid Course
          </label>

          {data.isPaid && (
            <input
              type="number"
              name="price"
              className="admin-editcourse-input admin-editcourse-price"
              placeholder="₹ Price"
              value={data.price}
              onChange={handleChange}
            />
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div className="admin-editcourse-footer">
        <button
          className="admin-editcourse-btn cancel"
          onClick={() => {
            Swal.fire({
              title: "Cancel editing?",
              text: "Changes will not be saved",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, cancel",
              cancelButtonText: "Continue Editing",
            }).then((res) => {
              if (res.isConfirmed) close();
            });
          }}
        >
          Cancel
        </button>

        <button
          className="admin-editcourse-btn save"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  </div>
);

};

export default EditCourseModal;

/* =========================
   REUSABLE INPUT
========================= */
const EditCourseField = ({ label, name, value, type = "text", onChange }) => (
  <div className="admin-editcourse-field">
    <label className="admin-editcourse-label">{label}</label>
    <input
      className="admin-editcourse-input"
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

