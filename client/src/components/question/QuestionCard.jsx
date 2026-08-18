import {
  ThumbsUp,
  CheckCircle,
  Pin,
  Archive,
  Trash2,
  User,
} from "lucide-react";

/**
 * QuestionCard Component
 * Displays question content, upvote count, status badges, and, in host
 * mode, moderation controls (pin/answer/archive/delete).
 *
 * Host actions here only call their corresponding question.api.js function
 * via the passed-in callback — they never update local state themselves.
 * The resulting Socket.IO broadcast (handled centrally in EventContext) is
 * what actually updates the shared question list this card re-renders
 * from. This keeps one single source of truth for "live" data instead of
 * risking the UI briefly showing two conflicting states (an optimistic
 * local update, then the broadcast arriving with possibly different data).
 *
 * @param {Object} props
 * @param {Object} props.question - Question data object
 * @param {boolean} props.isHost - Indicates whether logged-in user is the host
 * @param {boolean} props.hasUpvoted - Indicates if participant has upvoted this question
 * @param {Function} props.onUpvote - Callback for upvoting (one-directional — no un-vote)
 * @param {Function} props.onToggleAnswer - Callback for host to toggle answered status
 * @param {Function} props.onTogglePin - Callback for host to toggle pin status
 * @param {Function} props.onArchive - Callback for host to archive the question
 * @param {Function} props.onDelete - Callback for host to permanently delete the question
 */
export const QuestionCard = ({
  question,
  isHost = false,
  hasUpvoted = false,
  onUpvote,
  onToggleAnswer,
  onTogglePin,
  onArchive,
  onDelete,
}) => {
  const {
    _id,
    content,
    authorName,
    upvotes = 0,
    isAnswered = false,
    isPinned = false,
    createdAt,
  } = question;

  // Format timestamp (e.g., "2:45 PM")
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleDeleteClick = () => {
    // Destructive + unrecoverable, unlike pin/answer/archive, so this is
    // the one host action that gets a confirmation step, kept inside the
    // component itself so every caller gets it for free.
    if (
      window.confirm(
        "Are you sure you want to permanently delete this question? This cannot be undone.",
      )
    ) {
      onDelete && onDelete(_id);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
        isPinned
          ? "border-indigo-300 ring-1 ring-indigo-200 bg-indigo-50/30"
          : isAnswered
            ? "border-gray-200 bg-gray-50/60 opacity-80"
            : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Status Badges Row */}
      {(isPinned || isAnswered) && (
        <div className="flex items-center gap-2 mb-3 text-xs font-medium">
          {isPinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              <Pin className="w-3 h-3 fill-indigo-700" />
              Pinned
            </span>
          )}
          {isAnswered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Answered
            </span>
          )}
        </div>
      )}

      {/* Main Question Layout */}
      <div className="flex items-start gap-4">
        {/* Upvote Button — audience action, hidden in host mode */}
        {!isHost && (
          <button
            type="button"
            onClick={() => onUpvote && onUpvote(_id)}
            disabled={isAnswered || hasUpvoted}
            className={`flex flex-col items-center justify-center min-w-13 py-2 px-2.5 rounded-xl border transition-colors cursor-pointer ${
              hasUpvoted
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300"
            } ${isAnswered ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <ThumbsUp
              className={`w-4 h-4 mb-0.5 ${hasUpvoted ? "fill-white" : ""}`}
            />
            <span className="text-xs font-bold">{upvotes}</span>
          </button>
        )}

        {/* Vote count, shown as a plain badge in host mode instead of a button */}
        {isHost && (
          <div className="flex flex-col items-center justify-center min-w-13 py-2 px-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
            <ThumbsUp className="w-4 h-4 mb-0.5" />
            <span className="text-xs font-bold">{upvotes}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1">
          <p
            className={`text-gray-900 text-sm sm:text-base leading-relaxed wrap-break-words ${
              isAnswered ? "line-through text-gray-500" : ""
            }`}
          >
            {content}
          </p>

          {/* Author & Time Meta */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1 font-medium text-gray-500">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {authorName || "Anonymous"}
            </span>
            {formattedTime && (
              <>
                <span>•</span>
                <span>{formattedTime}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
          <button
            type="button"
            onClick={() => onTogglePin && onTogglePin(_id, !isPinned)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPinned
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={isPinned ? "Unpin Question" : "Pin Question"}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{isPinned ? "Unpin" : "Pin"}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleAnswer && onToggleAnswer(_id, !isAnswered)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAnswered
                ? "bg-emerald-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={isAnswered ? "Mark as Unanswered" : "Mark as Answered"}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isAnswered ? "Answered" : "Mark Answered"}</span>
          </button>

          <button
            type="button"
            onClick={() => onArchive && onArchive(_id)}
            className="p-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Archive Question"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Delete Question"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
