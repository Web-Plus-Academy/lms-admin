import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import EditInternshipModal from "../EditInternshipModal/EditInternshipModal";
import "./ViewInternship.css";

const ViewInternship = () => {
    const [internships, setInternships] = useState([]);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadInternships = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${SERVER_URL}/api/app-admin/internships`);
            setInternships(res.data.internships || []);
        } catch {
            Swal.fire("Error", "Failed to load internships", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInternships();
    }, []);

    const deleteInternship = async (id, role) => {
        const confirm = await Swal.fire({
            title: "Delete Internship?",
            text: `This will permanently delete "${role}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        await axios.delete(`${SERVER_URL}/api/app-admin/internships/${id}`);
        Swal.fire("Deleted", "Internship removed", "success");
        loadInternships();
    };

    if (loading) return <div className="course-state">Loading internships…</div>;
    if (!internships.length)
        return <div className="course-state">No internships found</div>;

    return (
        <>
            <div className="internship-view-grid">
                {internships.map((i) => (
                    <div className="internship-view-card" key={i._id}>

                        {/* HEADER */}
                        <div className="internship-view-header">
                            <h3 className="internship-view-title">{i.role}</h3>
                            <span className={`internship-view-badge ${i.internshipType}`}>
                                {i.internshipType.toUpperCase()}
                            </span>
                        </div>

                        {/* BASIC INFO */}
                        <div className="internship-view-section">
                            <p><b>Mode:</b> {i.mode}</p>
                            {i.mode === "Offline" && <p><b>Location:</b> {i.location}</p>}
                        </div>

                        {/* DETAILS */}
                        <div className="internship-view-info-grid">
                            <p><b>Duration:</b> {i.duration || "—"}</p>
                            <p><b>Deadline:</b> {i.deadline ? new Date(i.deadline).toLocaleDateString() : "—"}</p>
                            <p><b>Openings:</b> {i.openings ?? "—"}</p>
                            <p><b>Applicants:</b> {i.applicants ?? 0}</p>
                            <p>
                                <b>Status:</b>{" "}
                                <span className={i.isActive ? "status-active" : "status-inactive"}>
                                    {i.isActive ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>

                        {/* SKILLS & PAYMENT */}
                        <div className="internship-view-section">
                            <div className="internship-skill-row">
                                {i.skills?.map((skill, idx) => (
                                    <span className="internship-skill-pill" key={idx}>
                                        {skill}
                                    </span>
                                ))}
                            </div>


                            {i.internshipType === "paid" && (
                                <p><b>Application Fee:</b> ₹{i.applicationFee}</p>
                            )}

                            {i.internshipType === "stipend" && (
                                <p>
                                    <b>Stipend:</b> ₹{i.stipend?.amount} / {i.stipend?.frequency}
                                </p>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="internship-view-actions">
                            <button
                                className="internship-view-btn edit"
                                onClick={() => setEditData(i)}
                            >
                                Edit
                            </button>

                            <button
                                className="internship-view-btn delete"
                                onClick={() => deleteInternship(i._id, i.role)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editData && (
                <EditInternshipModal
                    internship={editData}
                    close={() => setEditData(null)}
                    refresh={loadInternships}
                />
            )}
        </>
    );

};

export default ViewInternship;
