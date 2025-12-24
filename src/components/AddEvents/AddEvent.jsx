import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./AddEvent.css";

const STORAGE_KEY = "add_event_form";

const EMPTY_FORM = {
  name: "",
  date: "",
  time: "",
  speaker: "",
  description: "",
  type: "",
  attendees: "",
  image: "",
  isPaid: false,
  price: "",
};

const AddEvent = () => {
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
    if (!form.name || !form.date || !form.type)
      return "Event Name, Date & Type are required";

    if (form.isPaid && Number(form.price) <= 0)
      return "Paid events must have a valid price";

    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return Swal.fire("Validation Error", error, "warning");

    try {
      setSubmitting(true);

      await axios.post(`${SERVER_URL}/api/app-admin/events/add`, {
        ...form,
        attendees: Number(form.attendees),
        price: form.isPaid ? Number(form.price) : 0,
      });

      Swal.fire("Success", "Event added successfully", "success");
      localStorage.removeItem(STORAGE_KEY);
      setForm(EMPTY_FORM);
    } catch {
      Swal.fire("Error", "Failed to add event", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <form className="admin-event-form" onSubmit={submit}>

    {/* ===== BASIC DETAILS ===== */}
    <div className="admin-event-section">
      <h4 className="admin-event-section-title">Event Details</h4>

      <div className="admin-event-grid">
        <EventInput label="Event Name" name="name" value={form.name} onChange={handleChange} />
        <EventInput label="Date" type="date" name="date" value={form.date} onChange={handleChange} />
        <EventInput label="Time" name="time" value={form.time} onChange={handleChange} />
        <EventInput label="Host of Event" name="speaker" value={form.speaker} onChange={handleChange} />
        <EventInput label="Attendees" type="number" name="attendees" value={form.attendees} onChange={handleChange} />
        <EventInput label="Image URL" name="image" value={form.image} onChange={handleChange} />
      </div>
    </div>

    {/* ===== EVENT TYPE ===== */}
    <div className="admin-event-section">
      <h4 className="admin-event-section-title">Event Type</h4>

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="admin-event-select"
      >
        <option value="">Select Type</option>
        <option value="quizathon">Quizathon (Online)</option>
        <option value="codeathon">Codeathon (Online)</option>
        <option value="webathon">Webathon (Online)</option>
      </select>
    </div>

    {/* ===== DESCRIPTION ===== */}
    <div className="admin-event-section">
      <h4 className="admin-event-section-title">Description</h4>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Event details..."
        className="admin-event-textarea"
      />
    </div>

    {/* ===== PRICING ===== */}
    <div className="admin-event-section">
      <h4 className="admin-event-section-title">Pricing</h4>

      <div className="admin-event-paid-row">
        <label className="admin-event-checkbox">
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleChange}
          />
          Paid Event
        </label>

        {form.isPaid && (
          <input
            type="number"
            name="price"
            placeholder="₹ Price"
            className="admin-event-input admin-event-price"
            value={form.price}
            onChange={handleChange}
          />
        )}
      </div>
    </div>

    {/* ===== ACTION ===== */}
    <div className="admin-event-actions">
      <button className="admin-event-btn" disabled={submitting}>
        {submitting ? "Adding..." : "Add Event"}
      </button>
    </div>

  </form>
);

};

export default AddEvent;

const EventInput = ({ label, ...props }) => (
  <div className="admin-event-field">
    <label className="admin-event-label">{label}</label>
    <input className="admin-event-input" {...props} />
  </div>
);
