import { motion, AnimatePresence } from "framer-motion";
import { Pin } from "lucide-react";
import { useEvent } from "../../hooks/useEvent";
import QuestionCard from "./QuestionCard";

/**
 * PinnedQuestionsPanel renders only questions currently in the "pinned"
 * state. Placed above QuestionList so a pinned question moves here rather
 * than reordering within the main list, keeping that list's scroll
 * position stable when a pin/unpin happens.
 *
 * Takes the same isHost/callback prop surface as QuestionList (rather
 * than a separate "mode" string) so QuestionCard has one consistent
 * contract regardless of which list is rendering it.
 *
 * @param {Object} props
 * @param {boolean} props.isHost - Whether to render host moderation controls
 * @param {Array} props.upvotedQuestionIds - Question IDs upvoted by current participant
 * @param {Function} props.onUpvote - Callback for upvoting (audience)
 * @param {Function} props.onToggleAnswer - Callback for host to toggle answered status
 * @param {Function} props.onTogglePin - Callback for host to toggle pin status
 * @param {Function} props.onArchive - Callback for host to archive a question
 * @param {Function} props.onDelete - Callback for host to delete a question
 */
export const PinnedQuestionsPanel = ({
  isHost = false,
  upvotedQuestionIds = [],
  onUpvote,
  onToggleAnswer,
  onTogglePin,
  onArchive,
  onDelete,
}) => {
  const { questions } = useEvent();

  // Filter strictly for pinned questions
  const pinnedQuestions = questions.filter((q) => q.isPinned === true);

  // Do not render empty container box if no questions are pinned
  if (pinnedQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
      <div className="mb-3 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
        <Pin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <h3>Pinned Questions</h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {pinnedQuestions.map((question) => (
            <motion.div
              key={question._id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionCard
                question={question}
                isHost={isHost}
                hasUpvoted={upvotedQuestionIds.includes(question._id)}
                onUpvote={onUpvote}
                onToggleAnswer={onToggleAnswer}
                onTogglePin={onTogglePin}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PinnedQuestionsPanel;
