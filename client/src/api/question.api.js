/**
 * API wrapper for question endpoints.
 * Handles audience creation/upvoting and host moderation actions.
 */
import axiosClient from "./axiosClient.js";

// --- Public / Audience Endpoints ---

/**
 * Submit a new question to an event.
 */
export const create = async (eventId, questionData) => {
  const response = await axiosClient.post(
    `/events/${eventId}/questions`,
    questionData,
  );
  return response.data;
};

/**
 * List all questions for a given event.
 */
export const listForEvent = async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}/questions`);
  return response.data;
};

/**
 * Upvote a question for an anonymous participant session.
 */
export const upvote = async (questionId, participantId) => {
  const response = await axiosClient.post(`/questions/${questionId}/upvote`, {
    participantId,
  });
  return response.data;
};

// --- Host Moderation Endpoints ---

/**
 * Toggle pin state for a question.
 */
export const pin = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/pin`);
  return response.data;
};

/**
 * Mark a question as answered.
 */
export const answer = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/answer`);
  return response.data;
};

/**
 * Move a question to archive.
 */
export const archive = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/archive`);
  return response.data;
};

/**
 * Permanently delete a question.
 */
export const deleteQuestion = async (questionId) => {
  const response = await axiosClient.delete(`/questions/${questionId}`);
  return response.data;
};
