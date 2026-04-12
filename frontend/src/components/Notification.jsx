import { useEffect, useState } from "react";
import Background from "./Background";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
    
  return (
    <div style={{ padding: "20px" }}>
        <Background />
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications
          .slice()
          .reverse()
          .map((n) => (
            <div
              key={n.id}
              style={{
                ...styles.item,
                ...styles[n.type]
              }}
            >
              {n.message}
            </div>
          ))
      )}
    </div>
  );
}

export default NotificationsPage;