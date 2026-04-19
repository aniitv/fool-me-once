import { useEffect, useState } from "react";
import Background from "./Background";
import "../styles/notification.css";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    fetch("http://localhost:5000/notification")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }
        return res.json();
      })
      .then((data) => setNotifications(data))
      .catch((err) => {
        console.error(err);
        setNotifications([]);
      });
  };

  useEffect(() => {
    fetchNotifications();

      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
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
            <div key={n.id} className ={`notification ${n.type}`}>
              {n.message}
            </div>
          ))
      )}
    </div>
  );
}

export default NotificationsPage;