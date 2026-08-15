import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

/**
 * Individual Toast popup item.
 * Auto-dismisses after 4 seconds and applies color/icon based on type.
 */
export const Toast = ({ id, message, type = "info", onClose }) => {
  // Auto-dismiss timer on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer); // Clean up timer if unmounted early
  }, [id, onClose]);

  // Styling & icons based on toast type
  const config = {
    error: {
      bg: "bg-red-50 text-red-800 border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    },
    success: {
      bg: "bg-green-50 text-green-800 border-green-200",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />,
    },
    info: {
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
    },
  };

  const currentConfig = config[type] || config.info;

  return (
    <div
      className={`flex items-center gap-3 w-80 max-w-full p-4 rounded-lg border shadow-md transition-all duration-300 ${currentConfig.bg}`}
    >
      {currentConfig.icon}
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 rounded-p-1 focus:outline-none cursor-pointer"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
