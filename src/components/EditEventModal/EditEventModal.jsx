import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./EditEventModal.css";

const EditEventModal = ({ event, close, refresh }) => {
    const [data, setData] = useState(event);
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

            await axios.put(`${SERVER_URL}/api/app-admin/events/${event._id}`, {
                ...data,
                attendees: Number(data.attendees),
                price: data.isPaid ? Number(data.price) : 0,
            });

            Swal.fire("Updated", "Event updated successfully", "success");
            refresh();
            close();
        } catch {
            Swal.fire("Error", "Failed to update event", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-editevent-overlay">
            <div className="admin-editevent-card">

                {/* HEADER */}
                <div className="admin-editevent-header">
                    <h3 className="admin-editevent-title">Edit Event</h3>
                    <button className="admin-editevent-close" onClick={close}>✕</button>
                </div>

                {/* BODY */}
                <div className="admin-editevent-body">

                    {/* BASIC DETAILS */}
                    <div className="admin-editevent-grid">
                        <EditEventField label="Event Name" name="name" value={data.name} onChange={handleChange} />
                        <EditEventField type="date" label="Date" name="date" value={data.date?.slice(0, 10)} onChange={handleChange} />
                        <EditEventField label="Time" name="time" value={data.time} onChange={handleChange} />
                        <EditEventField label="Host of Event" name="speaker" value={data.speaker} onChange={handleChange} />
                        <EditEventField type="number" label="Attendees" name="attendees" value={data.attendees} onChange={handleChange} />
                        <EditEventField label="Image URL" name="image" value={data.image} onChange={handleChange} />
                    </div>

                    {/* EVENT TYPE */}
                    <div className="admin-editevent-section">
                        <label className="admin-editevent-label">Event Type</label>
                        <select
                            className="admin-editevent-input"
                            name="type"
                            value={data.type}
                            onChange={handleChange}
                        >
                            <option value="quizathon">Quizathon (Online)</option>
                            <option value="codeathon">Codeathon (Online)</option>
                            <option value="webathon">Webathon (Online)</option>
                        </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="admin-editevent-section">
                        <label className="admin-editevent-label">Description</label>
                        <textarea
                            className="admin-editevent-textarea"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* PAID EVENT */}
                    <div className="admin-editevent-paid-row">
                        <label className="admin-editevent-checkbox">
                            <input
                                type="checkbox"
                                name="isPaid"
                                checked={data.isPaid}
                                onChange={handleChange}
                            />
                            Paid Event
                        </label>

                        {data.isPaid && (
                            <input
                                type="number"
                                name="price"
                                className="admin-editevent-input admin-editevent-price"
                                placeholder="₹ Price"
                                value={data.price}
                                onChange={handleChange}
                            />
                        )}
                    </div>

                </div>

                {/* FOOTER */}
                <div className="admin-editevent-footer">
                    <button className="admin-editevent-btn cancel" onClick={close}>
                        Cancel
                    </button>
                    <button
                        className="admin-editevent-btn save"
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

export default EditEventModal;


const EditEventField = ({ label, name, value, type = "text", onChange }) => (
    <div className="admin-editevent-field">
        <label className="admin-editevent-label">{label}</label>
        <input
            className="admin-editevent-input"
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
        />
    </div>
);
