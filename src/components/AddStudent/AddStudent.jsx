import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./AddStudent.css";
import SERVER_URL from "../../config/backendUrl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  userId: "",
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

const TOTAL_STEPS = 5; // 1–4 + Review

const AddStudent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("addStudentForm");
    return saved ? JSON.parse(saved) : INITIAL_FORM;
  });
  const [loading, setLoading] = useState(false);

  // 🔁 Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem("addStudentForm", JSON.stringify(formData));
  }, [formData]);

  // 🆔 Auto-generate userId like FSB10x (you can tweak logic)
  // useEffect(() => {
  //   if (formData.batch && !formData.userId) {
  //     const batchNum = Number(formData.batch) || 0;
  //     // Simple example: FSB + (100 + batchNo)
  //     const generated = `FSB${100 + batchNum}`;
  //     setFormData((prev) => ({ ...prev, userId: generated }));
  //   }
  // }, [formData.batch, formData.userId]);

  // 📊 Progress %
  const progress = useMemo(
    () => ((step - 1) / (TOTAL_STEPS - 1)) * 100,
    [step]
  );

  // 🔁 Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Validation per step
  const validateStep = () => {
    if (step === 1) {
      if (!formData.userId || !formData.email || !formData.password) {
        toast.warning("Please fill User ID, Email and Password.");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.fullName || !formData.dob || !formData.gender) {
        toast.warning("Please complete Name, DOB and Gender.");
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
        toast.warning("Please fill complete address details.");
        return false;
      }
    }

    if (step === 4) {
      if (!formData.batch || !formData.enrollmentDate || !formData.courseName) {
        toast.warning("Please fill batch, enrollment date and course name.");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // 🚀 Submit
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

      await Swal.fire({
        title: "Student Registered 🎉",
        html: `<b>${formData.fullName}</b> has been added successfully with ID <b>${formData.userId}</b>.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Clear form + localStorage + go back to step 1
      localStorage.removeItem("addStudentForm");
      setFormData(INITIAL_FORM);
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to register student!"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Preview card
  const PreviewCard = () => {
    const { address } = formData;
    return (
      <div className="preview-grid">
        <div className="preview-section">
          <h4>Account</h4>
          <p><strong>User ID:</strong> {formData.userId}</p>
          <p><strong>Email:</strong> {formData.email}</p>
        </div>
        <div className="preview-section">
          <h4>Personal</h4>
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
          <p>{address.doorNo}, {address.street}</p>
          <p>{address.city}, {address.state}</p>
          <p>{address.pincode}</p>
        </div>
        <div className="preview-section">
          <h4>Course</h4>
          <p><strong>Batch:</strong> {formData.batch}</p>
          <p><strong>Course:</strong> {formData.courseName}</p>
          <p><strong>Enrollment:</strong> {formData.enrollmentDate}</p>
        </div>
      </div>
    );
  };

  // 🧭 Step titles
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
        {/* Header */}
        <div className="wizard-header">
          <div>
            <h2>Add Student</h2>
            <p>Step {step} of {TOTAL_STEPS} · <span>{stepTitle[step]}</span></p>
          </div>
          {loading && <div className="saving-pill">Saving...</div>}
        </div>

        {/* Progress */}
        <div className="progress-wrapper">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="step-dots">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`step-dot ${step >= s ? "active" : ""}`}
              >
                {s === 5 ? "✓" : s}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="wizard-body">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-grid">
              <div className="field">
                <label>User ID <span className="star">*</span> </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="FSB105"
                  defaultValue="FSB"
                />
                {/* <small>Format: FSB10X (auto-suggested, but editable)</small> */}
              </div>

              <div className="field">
                <label>Email <span className="star">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                />
              </div>

              <div className="field">
                <label>Password <span className="star">*</span></label>
                <input
                  type="password"
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
                  placeholder="John Michael Smith"
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
                <label>Profile Image URL <span className="star">*</span></label>
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
                  placeholder="Primary contact number"
                />
              </div>

              <div className="field">
                <label>Secondary Phone (Optional)</label>
                <input
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  placeholder="Parent / guardian number"
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
                  placeholder="A-45"
                />
              </div>

              <div className="field">
                <label>Street <span className="star">*</span></label>
                <input
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Tech Park Avenue"
                />
              </div>

              <div className="field">
                <label>City <span className="star">*</span></label>
                <input
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                />
              </div>

              <div className="field">
                <label>State <span className="star">*</span></label>
                <input
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                />
              </div>

              <div className="field">
                <label>Pincode <span className="star">*</span></label>
                <input
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="form-grid">
              <div className="field">
                <label>Batch No. <span className="star">*</span></label>
                <input
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="3"
                />
                <small>Numeric batch identifier (e.g., 3)</small>
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
                <input
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="Full Stack Development"
                />
              </div>
            </div>
          )}

          {/* STEP 5 – REVIEW */}
          {step === 5 && (
            <div className="review-step">
              <h3>Review & Confirm</h3>
              <p>Please verify all details before registering the student.</p>
              <PreviewCard />
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="wizard-footer">
          <button
            className="ghost-btn"
            onClick={goBack}
            disabled={step === 1 || loading}
          >
            ⬅ Back
          </button>

          {step < TOTAL_STEPS && (
            <button
              className="primary-btn"
              onClick={goNext}
              disabled={loading}
            >
              Next ➜
            </button>
          )}

          {step === TOTAL_STEPS && (
            <button
              className="primary-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit & Register 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
