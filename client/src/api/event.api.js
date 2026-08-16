import axiosClient from "./axiosClient";

// 1. Create a new event
export const createEvent = async (eventData) => {
  const response = await axiosClient.post("/events", eventData);
  return response.data;
};

// 2. Fetch all events for logged-in host
export const getEvents = async () => {
  const response = await axiosClient.get("/events");
  return response.data;
};

// 3. Get single event details
export const getEventById = async (id) => {
  const response = await axiosClient.get(`/events/${id}`);
  return response.data.data.event;
};

// 4. Update event details
export const updateEvent = async (id, eventData) => {
  const response = await axiosClient.put(`/events/${id}`, eventData);
  return response.data;
};

// 5. Delete an event
export const deleteEvent = async (id) => {
  const response = await axiosClient.delete(`/events/${id}`);
  return response.data;
};

// 6. End an active event
export const endEvent = async (id) => {
  const response = await axiosClient.post(`/events/${id}/end`);
  return response.data;
};

// 7. Join event by 6-digit code (Audience)
export const joinEventByCode = async (code) => {
  const response = await axiosClient.get(`/events/join/${code}`);
  return response.data.data.event;
};
