import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./AddStudent.css";
import SERVER_URL from "../../config/backendUrl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  userId: "",
  studno: "",
  email: "",
  password: "",

  fullName: "",
  dob: "",
  gender: "",
  avatar: "",
  phone: "",
  secondaryPhone: "",

  address: {
    doorNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  },

  batch: "",
  enrollmentDate: "",
  courseName: "",
};

const TOTAL_STEPS = 5;

const AddStudent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("addStudentForm");
    return saved ? JSON.parse(saved) : INITIAL_FORM;
  });

  const [loading, setLoading] = useState(false);

  // 🔁 Persist form locally
  useEffect(() => {
    localStorage.setItem("addStudentForm", JSON.stringify(formData));
  }, [formData]);

  // 🆔 Auto-generate User ID: FSB101, FEB101, BEB201
  useEffect(() => {
    const { courseName, batch, studno } = formData;
    if (!courseName || !batch || !studno) return;

    const courseCodeMap = {
      "Full Stack Development": "FS",
      "Frontend Development": "FE",
      "Backend Development": "BE",
    };

    const courseCode = courseCodeMap[courseName] || "XX";
    const userId = `${courseCode}B${batch}${studno}`;

    setFormData((prev) => ({ ...prev, userId }));
  }, [formData.courseName, formData.batch, formData.studno]);

  // 📊 Progress %
  const progress = useMemo(
    () => ((step - 1) / (TOTAL_STEPS - 1)) * 100,
    [step]
  );

  // 🔁 Handle form updates
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ❌ Clear Form Button
  const handleClearForm = () => {
    Swal.fire({
      title: "Clear Form?",
      text: "All entered data will be erased!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("addStudentForm");
        setFormData(INITIAL_FORM);
        setStep(1);
        toast.info("Form cleared successfully");
      }
    });
  };

  // 🧾 Validation rules
  const validateStep = () => {
    if (step === 1) {
      if (!formData.studno || !formData.email || !formData.password) {
        toast.warning("Please fill Student No, Email & Password.");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.fullName || !formData.dob || !formData.gender) {
        toast.warning("Please fill Full Name, DOB & Gender.");
        return false;
      }
      if (!formData.phone) {
        toast.warning("Please enter primary phone number.");
        return false;
      }
    }

    if (step === 3) {
      const { doorNo, street, city, state, pincode } = formData.address;
      if (!doorNo || !street || !city || !state || !pincode) {
        toast.warning("Please fill complete address.");
        return false;
      }
    }

    if (step === 4) {
      if (!formData.batch || !formData.enrollmentDate || !formData.courseName) {
        toast.warning("Please fill batch, enrollment date & course name.");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // 🚀 Submit form
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        batch: Number(formData.batch),
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        enrollmentDate: formData.enrollmentDate
          ? new Date(formData.enrollmentDate).toISOString()
          : null,
      };

      await axios.post(`${SERVER_URL}/api/adminAccess/register`, payload);

      Swal.fire({
        title: "Student Registered 🎉",
        html: `Student <b>${formData.fullName}</b> added successfully with ID <b>${formData.userId}</b>.`,
        icon: "success",
      });

      localStorage.removeItem("addStudentForm");
      setFormData(INITIAL_FORM);
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // 🪪 Preview of entered data
  const PreviewCard = () => (
    <div className="preview-grid">
      <div className="preview-section">
        <h4>Account Info</h4>
        <div className="acc-preview">
          <p className="preview-avatar"><img src={formData.avatar} alt="" /></p>
          <div>

            <p><strong>User ID:</strong> {formData.userId}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Password:</strong> {formData.password}</p>
          </div>

        </div>
      </div>
      <div className="preview-section">
        <h4>Personal Data</h4>
        <p><strong>Name:</strong> {formData.fullName}</p>
        <p><strong>DOB:</strong> {formData.dob}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        {formData.secondaryPhone && (
          <p><strong>Secondary Phone:</strong> {formData.secondaryPhone}</p>
        )}
      </div>
      <div className="preview-section">
        <h4>Address</h4>
        <p>{formData.address.doorNo}, {formData.address.street}</p>
        <p>{formData.address.city}, {formData.address.state}</p>
        <p>{formData.address.pincode}</p>
      </div>
      <div className="preview-section">
        <h4>Course Details</h4>
        <p><strong>Batch:</strong> {formData.batch}</p>
        <p><strong>Course:</strong> {formData.courseName}</p>
        <p><strong>Enrollment:</strong> {formData.enrollmentDate}</p>
      </div>
    </div>
  );

  const stepTitle = {
    1: "Account Details",
    2: "Personal Information",
    3: "Address Details",
    4: "Course & Enrollment",
    5: "Review & Confirm",
  };

  return (
    <div className="addstudent-wrapper">
      <div className="glass-card">
        <h2 className="heading">Add Student</h2>

        <div className="wizard-header">
          <p>Step {step} of {TOTAL_STEPS} • <span>{stepTitle[step]}</span></p>
          {loading && <div className="saving-pill">Saving...</div>}
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-wrapper">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="step-dots">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`step-dot ${step >= s ? "active" : ""}`}>
                {s === 5 ? "✓" : s}
              </div>
            ))}
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="wizard-body">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-grid">
              <div className="field">
                <label>Student No <span className="star">*</span></label>
                <input
                  name="studno"
                  value={formData.studno}
                  onChange={handleChange}
                  placeholder="01, 02, 03, ..., 10"
                />
                <small>User ID will be auto-generated</small>
              </div>

              <div className="field">
                <label>Email <span className="star">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@domain.com"
                />
              </div>

              <div className="field">
                <label>Password <span className="star">*</span></label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Temporary password"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-grid">
              <div className="field">
                <label>Full Name <span className="star">*</span></label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="field">
                <label>Date of Birth <span className="star">*</span></label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Gender <span className="star">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="field">
                <label>Profile Image URL</label>
                <input
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="field">
                <label>Phone <span className="star">*</span></label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Primary number"
                />
              </div>

              <div className="field">
                <label>Secondary Phone</label>
                <input
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  placeholder="Parent / Guardian number"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-grid">
              <div className="field">
                <label>Door No <span className="star">*</span></label>
                <input
                  name="address.doorNo"
                  value={formData.address.doorNo}
                  onChange={handleChange}
                  placeholder="Door Number"
                />
              </div>

              <div className="field">
                <label>Street <span className="star">*</span></label>
                <input
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Name"
                />
              </div>

              <div className="field">
                <label>City <span className="star">*</span></label>
                <input
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="field">
                <label>State <span className="star">*</span></label>
                <input
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="field">
                <label>Pincode <span className="star">*</span></label>
                <input
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="form-grid">
              <div className="field">
                <label>Batch No <span className="star">*</span></label>
                <input
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>

              <div className="field">
                <label>Enrollment Date <span className="star">*</span></label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Course Name <span className="star">*</span></label>
                <select
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="review-step">
              <h3>Review & Confirm</h3>
              <PreviewCard />
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="wizard-footer">


          <button
            className="ghost-btn"
            onClick={goBack}
            disabled={step === 1}
          >
            ⬅ Back
          </button>

          <button className="danger-btn" onClick={handleClearForm}>
            Clear Form ✖
          </button>

          {step < 5 && (
            <button className="primary-btn" onClick={goNext}>
              Next ➜
            </button>
          )}

          {step === 5 && (
            <button className="primary-btn" onClick={handleSubmit}>
              Submit & Register 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddStudent;
