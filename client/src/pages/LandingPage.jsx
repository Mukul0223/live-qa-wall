import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const LandingPage = () => {
  const [health, setHealth] = useState("Checking health...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/health")
      .then((response) => {
        console.log("Full Axios Response:", response);
        console.log("Response data:", response.data);
        setHealth(response.data.message || "Connected");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Health check failed", error);
        setHealth("Disconnected");
        setLoading(false);
      });
  }, []);

  return (
    <h1 className="text-4xl text-red-500 font-bold bg-indigo-50 p-4">
      {loading ? "Loading.." : `Backend status: ${health}`}
    </h1>
  );
};

export default LandingPage;
