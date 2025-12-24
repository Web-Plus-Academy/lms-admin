import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./AddCourse.css";

const STORAGE_KEY = "add_course_form";

const EMPTY_FORM = {
  title: "",
  description: "",
  duration: "",
  instructor: "",
  image: "",
  category: "",
  rating: "",
  students: "",
  startDate: "",
  enrollClose: "",
  isPaid: false,
  price: "",
};

const AddCourse = () => {
  /* =========================
     LOAD FROM LOCAL STORAGE
  ========================= */
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : EMPTY_FORM;
  });

  const [submitting, setSubmitting] = useState(false);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     VALIDATION
  ========================= */
  const validateForm = () => {
    if (form.title.trim().length < 3)
      return "Course title must be at least 3 characters";

    if (form.description.trim().length < 20)
      return "Description must be at least 20 characters";

    if (!form.duration) return "Duration is required";
    if (!form.instructor) return "Instructor is required";
    if (!form.category) return "Category is required";

    if (form.image) {
      const urlRegex =
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/;
      if (!urlRegex.test(form.image)) return "Invalid image URL";
    }

    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 5)
      return "Rating must be between 0.0 and 5.0";

    if (Number(form.students) < 0)
      return "Students cannot be negative";

    if (!form.startDate || !form.enrollClose)
      return "Dates are required";

    // if (new Date(form.enrollClose) <= new Date(form.startDate))
    //   return "Enroll close must be after start date";

    if (form.isPaid && Number(form.price) <= 0)
      return "Price must be greater than 0";

    return null;
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      Swal.fire("Validation Error", error, "warning");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${SERVER_URL}/api/app-admin/courses/add`, {
        ...form,
        rating: parseFloat(form.rating),
        students: Number(form.students),
        price: form.isPaid ? Number(form.price) : 0,
      });

      Swal.fire("Success", "Course added successfully", "success");

      // ✅ CLEAR AFTER SUCCESS
      localStorage.removeItem(STORAGE_KEY);
      setForm(EMPTY_FORM);
    } catch (err) {
      Swal.fire("Error", "Failed to add course", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     CLEAR BUTTON
  ========================= */
  const clearForm = () => {
    Swal.fire({
      title: "Clear Form?",
      text: "All entered data will be lost",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(STORAGE_KEY);
        setForm(EMPTY_FORM);
      }
    });
  };

  return (
  <form className="admin-course-form" onSubmit={submit}>

    {/* ===== BASIC DETAILS ===== */}
    <div className="admin-course-section">
      <h4 className="admin-course-section-title">Basic Details</h4>

      <div className="admin-course-grid">
        <CourseInput label="Title" name="title" value={form.title} placeholder="Full Stack Development" onChange={handleChange} />
        <CourseInput label="Duration" name="duration" value={form.duration} placeholder="6 Months" onChange={handleChange} />
        <CourseInput label="Instructor" name="instructor" value={form.instructor} placeholder="Saran Velmurugan" onChange={handleChange} />
        <CourseInput label="Image URL" name="image" value={form.image} placeholder="https://..." onChange={handleChange} />
        <CourseInput label="Category" name="category" value={form.category} placeholder="Frontend / Backend" onChange={handleChange} />
        <CourseInput label="Rating" name="rating" type="number" step="0.1" value={form.rating} placeholder="4.5" onChange={handleChange} />
        <CourseInput label="Students" name="students" type="number" value={form.students} placeholder="250" onChange={handleChange} />
        <CourseInput label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <CourseInput label="Enroll Close" name="enrollClose" type="date" value={form.enrollClose} onChange={handleChange} />
      </div>
    </div>

    {/* ===== DESCRIPTION ===== */}
    <div className="admin-course-section">
      <h4 className="admin-course-section-title">Description</h4>
      <textarea
        name="description"
        value={form.description}
        placeholder="Course details..."
        className="admin-course-textarea"
        onChange={handleChange}
      />
    </div>

    {/* ===== PRICING ===== */}
    <div className="admin-course-section">
      <h4 className="admin-course-section-title">Pricing</h4>

      <div className="admin-course-paid-row">
        <label className="admin-course-checkbox">
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleChange}
          />
          Paid Course
        </label>

        {form.isPaid && (
          <input
            type="number"
            name="price"
            placeholder="₹ Price"
            className="admin-course-input admin-course-price"
            value={form.price}
            onChange={handleChange}
          />
        )}
      </div>
    </div>

    {/* ===== ACTIONS ===== */}
    <div className="admin-course-actions">
      <button
        type="button"
        className="admin-course-btn secondary"
        onClick={clearForm}
      >
        Clear
      </button>

      <button className="admin-course-btn" disabled={submitting}>
        {submitting ? "Adding..." : "Add Course"}
      </button>
    </div>

  </form>
);

};

export default AddCourse;

/* =========================
   INPUT COMPONENT
========================= */
const CourseInput = ({ label, ...props }) => (
  <div className="admin-course-field">
    <label className="admin-course-label">{label}</label>
    <input className="admin-course-input" {...props} />
  </div>
);
