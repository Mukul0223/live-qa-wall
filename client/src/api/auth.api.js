/**
 * Auth API Service
 * Handles HTTP requests for host registration, login, and session validation.
 */
import axiosClient from "./axiosClient";

/**
 * Registers a new host account.
 */
export const register = async (name, email, password) => {
  const response = await axiosClient.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Authenticates an existing host.
 */
export const login = async (email, password) => {
  const response = await axiosClient.post("/auth/login", { email, password });
  return response.data;
};

/**
 * Fetches current authenticated host profile using stored JWT token.
 */
export const getCurrentUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};
