import { useState } from "react";
import { MessageSquare, Flame, Clock, CheckCircle2 } from "lucide-react";
import QuestionCard from "./QuestionCard";

/**
 * QuestionList Component
 * Displays list of event questions with filter tabs and empty states.
 *
 * @param {Object} props
 * @param {Array} props.questions - Array of question objects
 * @param {boolean} props.isHost - Logged-in user host status
 * @param {Array} props.upvotedQuestionIds - Array of question IDs upvoted by current user
 * @param {Function} props.onUpvote - Callback for upvoting
 * @param {Function} props.onToggleAnswer - Callback for toggling answer status
 * @param {Function} props.onTogglePin - Callback for toggling pin status
 * @param {Function} props.onArchive - Callback for archiving a question (host only)
 * @param {Function} props.onDelete - Callback for deleting
 */
export const QuestionList = ({
  questions = [],
  isHost = false,
  upvotedQuestionIds = [],
  onUpvote,
  onToggleAnswer,
  onTogglePin,
  onArchive,
  onDelete,
}) => {
  const [filter, setFilter] = useState("top"); // 'top' | 'recent' | 'answered'

  // Filter & Sort Logic
  const getFilteredQuestions = () => {
    // Archived questions are hidden from every view here — they're
    // intentionally moved out of the working list by the host, not
    // deleted. (status is a single enum on the backend, so a question
    // is never simultaneously archived and anything else.)
    let list = questions.filter((q) => !q.isArchived);

    if (filter === "answered") {
      return list.filter((q) => q.isAnswered);
    }

    // Keep unanswered active questions for 'top' and 'recent'
    const activeQuestions = list.filter((q) => !q.isAnswered);

    if (filter === "top") {
      // Sort pinned first, then highest upvotes
      return activeQuestions.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
        return b.upvotes - a.upvotes;
      });
    }

    if (filter === "recent") {
      // Pure chronological order — pinned-first only applies to "Top".
      // A pinned question still shows its badge here, it's just sorted
      // by creation time like everything else.
      return [...activeQuestions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return activeQuestions;
  };

  const displayedQuestions = getFilteredQuestions();

  const visibleQuestions = questions.filter((q) => !q.isArchived);
  const counts = {
    all: visibleQuestions.filter((q) => !q.isAnswered).length,
    answered: visibleQuestions.filter((q) => q.isAnswered).length,
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setFilter("top")}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === "top"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Top</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("recent")}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === "recent"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("answered")}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === "answered"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Answered ({counts.answered})</span>
          </button>
        </div>

        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          {counts.all} active {counts.all === 1 ? "question" : "questions"}
        </span>
      </div>

      {/* Questions Render List */}
      {displayedQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No questions here yet
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            {filter === "answered"
              ? "No questions have been marked as answered yet."
              : "Be the first participant to submit a question!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedQuestions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              isHost={isHost}
              hasUpvoted={upvotedQuestionIds.includes(q._id)}
              onUpvote={onUpvote}
              onToggleAnswer={onToggleAnswer}
              onTogglePin={onTogglePin}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
