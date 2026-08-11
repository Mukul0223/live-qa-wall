import { useState, useEffect } from "react";
import { NotificationContext } from "./notificationContextObject";
import { injectNotificationHandler } from "../api/axiosClient";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // 1. Function to add a toast notification
  const addNotification = (message, type = "info") => {
    const id = Date.now().toString(); // Simple unique ID
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // 2. Function to remove a toast notification by ID
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // 3. Connect the Axios Bridge on mount
  useEffect(() => {
    injectNotificationHandler(addNotification);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
