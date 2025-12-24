import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./AddWorkshop.css";

const STORAGE_KEY = "add_workshop_form";

const EMPTY_FORM = {
  topic: "",
  trainer: "",
  schedule: "",
  duration: "",
  description: "",
  capacity: "",
  skills: "",
  isPaid: false,
  price: "",
};

const AddWorkshop = () => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : EMPTY_FORM;
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.topic || !form.trainer || !form.schedule)
      return "Topic, Trainer & Schedule are required";

    if (form.isPaid && Number(form.price) <= 0)
      return "Paid workshop must have a valid price";

    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return Swal.fire("Validation Error", error, "warning");

    try {
      setSubmitting(true);

      await axios.post(`${SERVER_URL}/api/app-admin/workshops/add`, {
        topic: form.topic,
        trainer: form.trainer,
        schedule: form.schedule,
        duration: form.duration,
        description: form.description,
        capacity: Number(form.capacity),
        skills: form.skills.split(",").map((s) => s.trim()),
        isPaid: form.isPaid,
        price: form.isPaid ? Number(form.price) : 0,
      });

      Swal.fire("Success", "Workshop added successfully", "success");
      localStorage.removeItem(STORAGE_KEY);
      setForm(EMPTY_FORM);
    } catch {
      Swal.fire("Error", "Failed to add workshop", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <form className="admin-workshop-form" onSubmit={submit}>

    {/* ===== BASIC DETAILS ===== */}
    <div className="admin-workshop-section">
      <h4 className="admin-workshop-section-title">Workshop Details</h4>

      <div className="admin-workshop-grid">
        <WorkshopInput
          label="Workshop Topic"
          name="topic"
          value={form.topic}
          onChange={handleChange}
        />
        <WorkshopInput
          label="Trainer"
          name="trainer"
          value={form.trainer}
          onChange={handleChange}
        />
        <WorkshopInput
          label="Schedule"
          name="schedule"
          value={form.schedule}
          onChange={handleChange}
        />
        <WorkshopInput
          label="Duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
        />
        <WorkshopInput
          label="Capacity"
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
        />
        <WorkshopInput
          label="Skills (comma separated)"
          name="skills"
          value={form.skills}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* ===== DESCRIPTION ===== */}
    <div className="admin-workshop-section">
      <h4 className="admin-workshop-section-title">Description</h4>

      <textarea
        className="admin-workshop-textarea"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Workshop description..."
      />
    </div>

    {/* ===== PRICING ===== */}
    <div className="admin-workshop-section">
      <h4 className="admin-workshop-section-title">Pricing</h4>

      <div className="admin-workshop-paid-row">
        <label className="admin-workshop-checkbox">
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleChange}
          />
          Paid Workshop
        </label>

        {form.isPaid && (
          <input
            type="number"
            name="price"
            placeholder="₹ Price"
            className="admin-workshop-input admin-workshop-price"
            value={form.price}
            onChange={handleChange}
          />
        )}
      </div>
    </div>

    {/* ===== ACTION ===== */}
    <div className="admin-workshop-actions">
      <button className="admin-workshop-btn" disabled={submitting}>
        {submitting ? "Adding..." : "Add Workshop"}
      </button>
    </div>

  </form>
);

};

export default AddWorkshop;

const WorkshopInput = ({ label, ...props }) => (
  <div className="admin-workshop-field">
    <label className="admin-workshop-label">{label}</label>
    <input className="admin-workshop-input" {...props} />
  </div>
);

