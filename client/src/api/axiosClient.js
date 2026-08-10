import axios from "axios";
let addNotification = null;

const injectNotificationHandler = (action) => {
  addNotification = action;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("Network or timeout error", error.message);
      return Promise.reject(
        new Error("Network issues. Please check your connection."),
      );
    }
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    if (typeof addNotification === "function") {
      addNotification(message, "error");
    }
    return Promise.reject(error);
  },
);

export { injectNotificationHandler };
export default axiosClient;
