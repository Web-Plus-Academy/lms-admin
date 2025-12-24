import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./AddInternship.css";

const STORAGE_KEY = "add_internship_form";

const EMPTY_FORM = {
    role: "",
    description: "",
    duration: "",
    skills: "",
    mode: "",
    location: "",
    deadline: "",
    internshipType: "",
    applicationFee: "",
    stipendAmount: "",
    stipendFrequency: "monthly",
    openings: "",
};


const AddInternship = () => {
    const [form, setForm] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : EMPTY_FORM;
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const validate = () => {

        if (form.internshipType === "paid" && Number(form.applicationFee) <= 0)
            return "Paid internship must have application fee";
        if (!form.role || !form.mode || !form.internshipType)
            return "Role, Mode & Internship Type are required";

        if (form.mode === "Offline" && !form.location)
            return "Location is required for offline internships";

        if (
            form.internshipType === "stipend" &&
            Number(form.stipendAmount) <= 0
        )
            return "Stipend amount is required";

        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) return Swal.fire("Validation Error", error, "warning");

        try {
            setSubmitting(true);

            await axios.post(`${SERVER_URL}/api/app-admin/internships/add`, {
                role: form.role,
                description: form.description,
                duration: form.duration,
                skills: form.skills.split(",").map(s => s.trim()),
                mode: form.mode,
                location: form.mode === "Offline" ? form.location : null,
                deadline: form.deadline,
                internshipType: form.internshipType,
                applicationFee:
                    form.internshipType === "paid" ? Number(form.applicationFee) : 0,
                stipend:
                    form.internshipType === "stipend"
                        ? {
                            amount: Number(form.stipendAmount),
                            frequency: form.stipendFrequency,
                        }
                        : undefined,
                openings: Number(form.openings),
            });

            Swal.fire("Success", "Internship added", "success");
            localStorage.removeItem(STORAGE_KEY);
            setForm(EMPTY_FORM);
        } catch {
            Swal.fire("Error", "Failed to add internship", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
  <form className="internship-form" onSubmit={submit}>

  {/* ===== BASIC DETAILS ===== */}
  <div className="internship-section">
    <h4 className="internship-section-title">Basic Details</h4>

    <div className="internship-grid">
      <FormInput label="Role" name="role" value={form.role} onChange={handleChange} />
      <FormInput label="Duration" name="duration" value={form.duration} onChange={handleChange} />

      <FormInput label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
      <FormInput label="Deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
      <FormInput label="Openings" type="number" name="openings" value={form.openings} onChange={handleChange} />
    </div>
  </div>

  {/* ===== INTERNSHIP TYPE ===== */}
  <div className="internship-section">
    <h4 className="internship-section-title">Internship Type</h4>

    <div className="internship-grid-2">
      <div className="internship-field">
        <label className="internship-label">Type</label>
        <select className="internship-select" name="internshipType" value={form.internshipType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="stipend">Stipend</option>
        </select>
      </div>

      {form.internshipType === "paid" && (
        <>
          <FormInput label="Application Fee (₹)" type="number" name="applicationFee" value={form.applicationFee} onChange={handleChange} />
        </>
      )}

      {form.internshipType === "stipend" && (
        <>
          <FormInput label="Stipend Amount (₹)" type="number" name="stipendAmount" value={form.stipendAmount} onChange={handleChange} />
          <div className="internship-field">
            <label className="internship-label">Frequency</label>
            <select className="internship-select" name="stipendFrequency" value={form.stipendFrequency} onChange={handleChange}>
              <option value="monthly">Monthly</option>
              <option value="one-time">One Time</option>
            </select>
          </div>
        </>
      )}
    </div>
  </div>

  {/* ===== MODE ===== */}
  <div className="internship-section">
    <h4 className="internship-section-title">Mode</h4>

    <div className="internship-grid-2">
      <div className="internship-field">
        <label className="internship-label">Mode</label>
        <select className="internship-select" name="mode" value={form.mode} onChange={handleChange}>
          <option value="">Select Mode</option>
          <option value="Online">Online</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {form.mode === "Offline" && (
        <FormInput label="Location" name="location" value={form.location} onChange={handleChange} />
      )}
    </div>
  </div>

  {/* ===== DESCRIPTION ===== */}
  <div className="internship-section">
    <h4 className="internship-section-title">Description</h4>

    <textarea
      className="internship-textarea"
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="Enter detailed internship description..."
    />
  </div>

  <button className="internship-submit-btn" disabled={submitting}>
    {submitting ? "Adding..." : "Add Internship"}
  </button>
</form>

);

};

export default AddInternship;

const FormInput = ({ label, ...props }) => (
  <div className="internship-field">
    <label className="internship-label">{label}</label>
    <input className="internship-input" {...props} />
  </div>
);
