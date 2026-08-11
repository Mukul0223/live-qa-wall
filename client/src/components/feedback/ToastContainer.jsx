import { useNotification } from "../../hooks/useNotification";
import { Toast } from "./Toast";

/**
 * Fixed container rendered near the app root to display active toasts.
 */
export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
      {notifications.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
