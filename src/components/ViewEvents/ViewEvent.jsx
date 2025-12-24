import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SERVER_URL from "../../config/backendUrl";
import EditEventModal from "../EditEventModal/EditEventModal.jsx";
import "./ViewEvent.css";

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${SERVER_URL}/api/app-admin/events`);
            setEvents(res.data.events || []);
        } catch {
            Swal.fire("Error", "Failed to load events", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const deleteEvent = async (id, name) => {
        const confirm = await Swal.fire({
            title: "Delete Event?",
            text: `Delete "${name}" permanently`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        await axios.delete(`${SERVER_URL}/api/app-admin/events/${id}`);
        Swal.fire("Deleted", "Event deleted", "success");
        loadEvents();
    };

    if (loading) return <div className="course-state">Loading events…</div>;
    if (!events.length) return <div className="course-state">No events found</div>;

    return (
        <>
            <div className="event-view-grid">
                {events.map((e) => (
                    <div className="event-view-card" key={e._id}>

                        {/* IMAGE */}
                        <div
                            className="event-view-image"
                            style={{
                                backgroundImage: `url(${e.image || "https://via.placeholder.com/600x400?text=Event"
                                    })`,
                            }}
                        >
                            {/* TOP BADGES */}
                            <div className="event-view-badges">
                                <span className={`event-type-pill ${e.type}`}>
                                    {e.type}
                                </span>

                                <span className={`event-status-pill ${e.isPaid ? "paid" : "free"}`}>
                                    {e.isPaid ? `₹${e.price}` : "Free"}
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="event-view-content">

                            <h3 className="event-title">{e.name}</h3>

                            <div className="event-meta">
                                <span className="event-meta-item">
                                    <CalendarIcon />
                                    {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                                </span>

                                <span className="event-meta-item">
                                    <ClockIcon />
                                    {e.time || "—"}
                                </span>

                                <span className="event-meta-item">
                                    <MicIcon />
                                    {e.speaker || "—"}
                                </span>

                                <span className="event-meta-item">
                                    <UsersIcon />
                                    {e.attendees || 0} attending
                                </span>
                            </div>



                            <p className="event-description">
                                {e.description || "No description available."}
                            </p>

                            {/* ACTIONS */}
                            <div className="event-view-actions">
                                <button className="event-btn edit" onClick={() => setEditEvent(e)}>
                                    Edit
                                </button>
                                <button
                                    className="event-btn delete"
                                    onClick={() => deleteEvent(e._id, e.name)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {editEvent && (
                <EditEventModal
                    event={editEvent}
                    close={() => setEditEvent(null)}
                    refresh={loadEvents}
                />
            )}
        </>
    );

};

export default ViewEvents;


const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="17"
      rx="2"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <path
      d="M8 2v4M16 2v4M3 10h18"
      stroke="#2563eb"
      strokeWidth="2"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="#2563eb" strokeWidth="2" />
  </svg>
);

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="3"
      width="6"
      height="11"
      rx="3"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <path
      d="M5 10v2a7 7 0 0014 0v-2"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <path d="M12 19v2" stroke="#2563eb" strokeWidth="2" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="4" stroke="#2563eb" strokeWidth="2" />
    <path
      d="M3 20c0-3 3-5 6-5s6 2 6 5"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <circle cx="17" cy="9" r="3" stroke="#2563eb" strokeWidth="2" />
  </svg>
);
