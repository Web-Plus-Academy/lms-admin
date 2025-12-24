import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import "./EditInternshipModal.css";

const EditInternshipModal = ({ internship, close, refresh }) => {
    const [data, setData] = useState({
        ...internship,
        skills: internship.skills?.join(", "),
        stipendAmount: internship.stipend?.amount || "",
        stipendFrequency: internship.stipend?.frequency || "monthly",
    });


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const save = async () => {
        try {
            const payload = {
                role: data.role,
                description: data.description,
                duration: data.duration,
                skills: data.skills.split(",").map(s => s.trim()),
                mode: data.mode,
                location: data.mode === "Offline" ? data.location : null,
                deadline: data.deadline,
                internshipType: data.internshipType,
                applicationFee:
                    data.internshipType === "paid" ? Number(data.applicationFee) : 0,
                stipend:
                    data.internshipType === "stipend"
                        ? {
                            amount: Number(data.stipendAmount),
                            frequency: data.stipendFrequency,
                        }
                        : undefined,
                openings: Number(data.openings),
                isActive: data.isActive,
            };


            await axios.put(
                `${SERVER_URL}/api/app-admin/internships/${internship._id}`,
                payload
            );

            Swal.fire("Updated", "Internship updated successfully", "success");
            refresh();
            close();
        } catch {
            Swal.fire("Error", "Failed to update internship", "error");
        }
    };

       return (
        <div className="internship-edit-overlay">
            <div className="internship-edit-card">

                <h3 className="internship-edit-title">Edit Internship</h3>

                {/* BASIC DETAILS */}
                <div className="internship-edit-section">
                    <h4 className="internship-edit-section-title">Basic Details</h4>

                    <div className="internship-edit-grid">
                        <div className="internship-edit-field">
                            <label>Role</label>
                            <input name="role" value={data.role} onChange={handleChange} />
                        </div>

                        <div className="internship-edit-field">
                            <label>Duration</label>
                            <input name="duration" value={data.duration} onChange={handleChange} />
                        </div>

                        <div className="internship-edit-field">
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={data.deadline?.slice(0, 10)}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="internship-edit-field">
                            <label>Skills</label>
                            <input
                                name="skills"
                                value={data.skills}
                                onChange={handleChange}
                                placeholder="Comma separated"
                            />
                        </div>

                        <div className="internship-edit-field">
                            <label>Openings</label>
                            <input
                                type="number"
                                name="openings"
                                value={data.openings}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* INTERNSHIP TYPE */}
                <div className="internship-edit-section">
                    <h4 className="internship-edit-section-title">Internship Type</h4>

                    <div className="internship-edit-grid-2">
                        <div className="internship-edit-field">
                            <label>Type</label>
                            <select
                                name="internshipType"
                                value={data.internshipType}
                                onChange={handleChange}
                            >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="stipend">Stipend</option>
                            </select>
                        </div>

                        {data.internshipType === "paid" && (
                            <div className="internship-edit-field">
                                <label>Application Fee (₹)</label>
                                <input
                                    type="number"
                                    name="applicationFee"
                                    value={data.applicationFee}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {data.internshipType === "stipend" && (
                            <>
                                <div className="internship-edit-field">
                                    <label>Stipend Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="stipendAmount"
                                        value={data.stipendAmount}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="internship-edit-field">
                                    <label>Frequency</label>
                                    <select
                                        name="stipendFrequency"
                                        value={data.stipendFrequency}
                                        onChange={handleChange}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="one-time">One Time</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* MODE */}
                <div className="internship-edit-section">
                    <h4 className="internship-edit-section-title">Mode</h4>

                    <div className="internship-edit-grid-2">
                        <div className="internship-edit-field">
                            <label>Mode</label>
                            <select name="mode" value={data.mode} onChange={handleChange}>
                                <option value="Online">Online</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        {data.mode === "Offline" && (
                            <div className="internship-edit-field">
                                <label>Location</label>
                                <input
                                    name="location"
                                    value={data.location || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="internship-edit-section">
                    <h4 className="internship-edit-section-title">Description</h4>
                    <textarea
                        className="internship-edit-textarea"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                    />
                </div>

                {/* STATUS */}
                <label className="internship-edit-checkbox">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={data.isActive}
                        onChange={handleChange}
                    />
                    Active Internship
                </label>

                {/* ACTIONS */}
                <div className="internship-edit-actions">
                    <button className="internship-edit-cancel" onClick={close}>
                        Cancel
                    </button>
                    <button className="internship-edit-save" onClick={save}>
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
    };

export default EditInternshipModal;
