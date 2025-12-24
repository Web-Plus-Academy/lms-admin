import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./EditWorkshopModal.css";

const EditWorkshopModal = ({ workshop, close, refresh }) => {
  const [data, setData] = useState({
    ...workshop,
    skills: workshop.skills?.join(", "),
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async () => {
    try {
      setSaving(true);

      await axios.put(`${SERVER_URL}/api/app-admin/workshops/${workshop._id}`, {
        topic: data.topic,
        trainer: data.trainer,
        schedule: data.schedule,
        duration: data.duration,
        description: data.description,
        capacity: Number(data.capacity),
        skills: data.skills.split(",").map((s) => s.trim()),
        isPaid: data.isPaid,
        price: data.isPaid ? Number(data.price) : 0,
      });

      Swal.fire("Updated", "Workshop updated successfully", "success");
      refresh();
      close();
    } catch {
      Swal.fire("Error", "Failed to update workshop", "error");
    } finally {
      setSaving(false);
    }
  };

return (
  <div className="admin-editworkshop-overlay">
    <div className="admin-editworkshop-card">

      {/* HEADER */}
      <div className="admin-editworkshop-header">
        <h3 className="admin-editworkshop-title">Edit Workshop</h3>
        <button
          className="admin-editworkshop-close"
          onClick={close}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="admin-editworkshop-body">

        <div className="admin-editworkshop-grid">
          <EditWorkshopField
            label="Workshop Topic"
            name="topic"
            value={data.topic}
            onChange={handleChange}
          />
          <EditWorkshopField
            label="Trainer"
            name="trainer"
            value={data.trainer}
            onChange={handleChange}
          />
          <EditWorkshopField
            label="Schedule"
            name="schedule"
            value={data.schedule}
            onChange={handleChange}
          />
          <EditWorkshopField
            label="Duration"
            name="duration"
            value={data.duration}
            onChange={handleChange}
          />
          <EditWorkshopField
            type="number"
            label="Capacity"
            name="capacity"
            value={data.capacity}
            onChange={handleChange}
          />
          <EditWorkshopField
            label="Skills (comma separated)"
            name="skills"
            value={data.skills}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="admin-editworkshop-section">
          <label className="admin-editworkshop-label">Description</label>
          <textarea
            className="admin-editworkshop-textarea"
            name="description"
            value={data.description}
            onChange={handleChange}
          />
        </div>

        {/* PAID WORKSHOP */}
        <div className="admin-editworkshop-paid-row">
          <label className="admin-editworkshop-checkbox">
            <input
              type="checkbox"
              name="isPaid"
              checked={data.isPaid}
              onChange={handleChange}
            />
            Paid Workshop
          </label>

          {data.isPaid && (
            <input
              type="number"
              name="price"
              className="admin-editworkshop-input admin-editworkshop-price"
              placeholder="₹ Price"
              value={data.price}
              onChange={handleChange}
            />
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div className="admin-editworkshop-footer">
        <button
          className="admin-editworkshop-btn cancel"
          onClick={close}
        >
          Cancel
        </button>

        <button
          className="admin-editworkshop-btn save"
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

export default EditWorkshopModal;

const EditWorkshopField = ({
  label,
  name,
  value,
  type = "text",
  onChange,
}) => (
  <div className="admin-editworkshop-field">
    <label className="admin-editworkshop-label">{label}</label>
    <input
      className="admin-editworkshop-input"
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);
