import { useEffect, useState } from "react";
import Background from "./Background";
import "../styles/notification.css";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));

    const source = new EventSource(
      "http://localhost:5000/notifications/subscribe",
    );

    source.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [...prev, notification]);
    };

    source.onerror = () => source.close();

    return () => source.close();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Background />

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications
          .slice()
          .reverse()
          .map((n) => (
            <div key={n.id} className={`notification ${n.type}`}>
              {n.message}
            </div>
          ))
      )}
    </div>
  );
}

export default NotificationsPage;
