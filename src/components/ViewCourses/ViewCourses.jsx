import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import EditCourseModal from "../EditCourseModal/EditCourseModal";
import SERVER_URL from "../../config/backendUrl";
import "./ViewCourses.css";

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD COURSES
  ========================= */
  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/app-admin/courses`);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to load courses",
        text: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* =========================
     DELETE COURSE (SWAL)
  ========================= */
  const deleteCourse = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete "${title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${SERVER_URL}/api/app-admin/courses/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Course deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      loadCourses();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Unable to delete course",
      });
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
  return <div className="admin-course-state">Loading courses…</div>;
}

if (!courses.length) {
  return <div className="admin-course-state">No courses found</div>;
}

return (
  <>
    <div className="admin-course-view-grid">
      {courses.map((course) => (
        <div className="admin-course-view-card" key={course._id}>

          {/* IMAGE */}
          <div className="admin-course-view-image">
            <img
              src={
                course.image ||
                "https://via.placeholder.com/400x220?text=Course+Image"
              }
              alt={course.title}
            />

            <span className="admin-course-category">
              {course.category || "General"}
            </span>

            <span
              className={`admin-course-badge ${
                course.isPaid ? "paid" : "free"
              }`}
            >
              {course.isPaid ? "Paid" : "Free"}
            </span>
          </div>

          {/* CONTENT */}
          <div className="admin-course-view-content">

            {/* TITLE + PRICE */}
            <div className="admin-course-title-row">
              <h3 className="admin-course-title">{course.title}</h3>
              <span
                className={`admin-course-price ${
                  course.isPaid ? "" : "free"
                }`}
              >
                {course.isPaid ? `₹${course.price}` : "Free"}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="admin-course-description">
              {course.description}
            </p>

            {/* META */}
            <div className="admin-course-meta">
              <span className="admin-course-meta-item">
                <ClockIcon />
                {course.duration}
              </span>
              <span className="admin-course-meta-item">
                <UsersIcon />
                {course.students || 0}
              </span>
              <span className="admin-course-meta-item">
                <StarIcon />
                {course.rating || 0}
              </span>
            </div>

            {/* DATES */}
            <div className="admin-course-dates">
              <span className="admin-course-date">
                <CalendarIcon />
                Start:
                <strong>
                  {course.startDate
                    ? new Date(course.startDate).toLocaleDateString()
                    : "—"}
                </strong>
              </span>

              <span className="admin-course-date">
                <DeadlineIcon />
                Enroll till:
                <strong>
                  {course.enrollClose
                    ? new Date(course.enrollClose).toLocaleDateString()
                    : "—"}
                </strong>
              </span>
            </div>

            {/* FOOTER */}
            <div className="admin-course-footer">
              <span className="admin-course-instructor">
                By {course.instructor}
              </span>

              <div className="admin-course-actions">
                <button
                  className="admin-course-btn edit"
                  onClick={() => setEditCourse(course)}
                >
                  Edit
                </button>

                <button
                  className="admin-course-btn delete"
                  onClick={() =>
                    deleteCourse(course._id, course.title)
                  }
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>

    {editCourse && (
      <EditCourseModal
        course={editCourse}
        close={() => setEditCourse(null)}
        refresh={loadCourses}
      />
    )}
  </>
);

};

export default ViewCourses;

/* =========================
   SVG ICONS (INLINE)
========================= */

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="#2563eb" strokeWidth="2" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="4" stroke="#2563eb" strokeWidth="2" />
    <path
      d="M3 20c0-3 3-5 6-5s6 2 6 5"
      stroke="#2563eb"
      strokeWidth="2"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15">
    <path d="M12 3l2.8 5.7L21 10l-4.5 4.3L17.6 21 12 18l-5.6 3 1.1-6.7L3 10l6.2-1.3L12 3z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="17"
      rx="2"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <path
      d="M8 2v4M16 2v4M3 10h18"
      stroke="#2563eb"
      strokeWidth="2"
    />
  </svg>
);

const DeadlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="2" />
    <path
      d="M12 7v5l3 2"
      stroke="#dc2626"
      strokeWidth="2"
    />
  </svg>
);
