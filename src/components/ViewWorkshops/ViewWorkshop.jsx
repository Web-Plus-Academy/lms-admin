import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import EditWorkshopModal from "../EditWorkshopModal/EditWorkshopModal.jsx";
import "./ViewWorkshops.css";

const ViewWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/app-admin/workshops`);
      setWorkshops(res.data.workshops || []);
    } catch {
      Swal.fire("Error", "Failed to load workshops", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const deleteWorkshop = async (id, topic) => {
    const confirm = await Swal.fire({
      title: "Delete Workshop?",
      text: `This will permanently delete "${topic}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`${SERVER_URL}/api/app-admin/workshops/${id}`);
    Swal.fire("Deleted", "Workshop deleted", "success");
    loadWorkshops();
  };

  if (loading) return <div className="course-state">Loading workshops…</div>;
  if (!workshops.length)
    return <div className="course-state">No workshops found</div>;

return (
  <>
    <div className="workshop-view-grid">
      {workshops.map((w) => (
        <div className="workshop-view-card" key={w._id}>

          {/* HEADER */}
          <div className="workshop-view-header">
            <h3 className="workshop-view-title">{w.topic}</h3>

            <span
              className={`workshop-view-price ${
                w.isPaid ? "paid" : "free"
              }`}
            >
              {w.isPaid ? `₹${w.price}` : "Free"}
            </span>
          </div>

          {/* META */}
          <div className="workshop-view-meta">
            <p><b>Trainer:</b> {w.trainer}</p>
            <p><b>Schedule:</b> {w.schedule}</p>
            <p><b>Duration:</b> {w.duration}</p>
            <p><b>Capacity:</b> {w.capacity}</p>
            <p><b>Enrolled:</b> {w.enrolled || 0}</p>
          </div>

          {/* SKILLS */}
          <div className="workshop-skill-row">
            {w.skills?.map((skill, idx) => (
              <span className="workshop-skill-pill" key={idx}>
                {skill}
              </span>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="workshop-view-actions">
            <button
              className="workshop-btn edit"
              onClick={() => setEditData(w)}
            >
              Edit
            </button>

            <button
              className="workshop-btn delete"
              onClick={() => deleteWorkshop(w._id, w.topic)}
            >
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>

    {editData && (
      <EditWorkshopModal
        workshop={editData}
        close={() => setEditData(null)}
        refresh={loadWorkshops}
      />
    )}
  </>
);

};

export default ViewWorkshops;
