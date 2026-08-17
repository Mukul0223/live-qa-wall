/**
 * API wrapper for question endpoints.
 * Handles audience creation/upvoting and host moderation actions.
 */
import axiosClient from "./axiosClient.js";
import {
  normalizeQuestion,
  normalizeQuestions,
  toBackendQuestionPayload,
} from "../utils/normalizeQuestion.js";

// --- Public / Audience Endpoints ---

/**
 * Submit a new question to an event.
 * Accepts the frontend shape ({ content, authorName }) and translates
 * it to what the backend controller destructures ({ text, authorNickname }).
 */
export const create = async (eventId, questionData) => {
  const response = await axiosClient.post(
    `/events/${eventId}/questions`,
    toBackendQuestionPayload(questionData),
  );
  return normalizeQuestion(response.data.data.question);
};

/**
 * List all questions for a given event.
 */
export const listForEvent = async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}/questions`);
  return normalizeQuestions(response.data.data.questions);
};

/**
 * Upvote a question for an anonymous participant session.
 */
export const upvote = async (questionId, participantId) => {
  const response = await axiosClient.post(`/questions/${questionId}/upvote`, {
    participantId,
  });
  return normalizeQuestion(response.data.data.question);
};

// --- Host Moderation Endpoints ---

/**
 * Toggle pin state for a question.
 */
export const pin = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/pin`);
  return normalizeQuestion(response.data.data.question);
};

/**
 * Mark a question as answered.
 */
export const answer = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/answer`);
  return normalizeQuestion(response.data.data.question);
};

/**
 * Move a question to archive.
 */
export const archive = async (questionId) => {
  const response = await axiosClient.patch(`/questions/${questionId}/archive`);
  return normalizeQuestion(response.data.data.question);
};

/**
 * Permanently delete a question.
 */
export const deleteQuestion = async (questionId) => {
  const response = await axiosClient.delete(`/questions/${questionId}`);
  return response.data; // { success, message } — no `question` to unwrap
};
