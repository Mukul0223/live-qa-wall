/**
 * The backend Question document uses: text, authorNickname, upvoteCount,
 * and a single `status` enum ("active" | "pinned" | "answered" | "archived").
 * The frontend components (QuestionCard, QuestionList, PinnedQuestionsPanel)
 * were built against: content, authorName, upvotes, isPinned, isAnswered.
 *
 * This is the single place that bridges the two shapes, so every entry
 * point (REST responses AND socket payloads, which are raw backend
 * documents) produces a consistent object for the rest of the app.
 */

// Backend document -> shape the frontend components expect
export const normalizeQuestion = (q) => {
  if (!q) return q;
  return {
    ...q,
    content: q.text,
    authorName: q.authorNickname,
    upvotes: q.upvoteCount ?? 0,
    isPinned: q.status === "pinned",
    isAnswered: q.status === "answered",
  };
};

export const normalizeQuestions = (list) =>
  Array.isArray(list) ? list.map(normalizeQuestion) : list;

// Frontend submission payload -> shape the backend controller expects
export const toBackendQuestionPayload = ({ content, authorName }) => ({
  text: content,
  authorNickname: authorName,
});
