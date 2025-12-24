const activities = [
  { text: "New course added: Full Stack Development", time: "10 mins ago" },
  { text: "Internship posted: Frontend Intern", time: "1 hour ago" },
  { text: "Workshop enrollment reached capacity", time: "3 hours ago" },
  { text: "New student registered", time: "Today" },
];

const RecentActivity = () => (
  <div className="admin-panel-card">
    <h3 className="admin-panel-title">Recent Activity</h3>

    <ul className="admin-activity-list">
      {activities.map((a, i) => (
        <li key={i}>
          <span className="admin-activity-dot" />
          <div>
            <p>{a.text}</p>
            <small>{a.time}</small>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
