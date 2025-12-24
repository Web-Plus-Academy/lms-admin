const notifications = [
  "3 students pending payment",
  "Workshop capacity almost full",
  "New internship applications received",
];

const NotificationsPanel = () => (
  <div className="admin-panel-card">
    <h3 className="admin-panel-title">Notifications</h3>

    <ul className="admin-notification-list">
      {notifications.map((n, i) => (
        <li key={i}>{n}</li>
      ))}
    </ul>
  </div>
);

export default NotificationsPanel;
