import { motion, AnimatePresence } from "framer-motion";
import { Pin } from "lucide-react";
import { useEvent } from "../../hooks/useEvent";
import QuestionCard from "./QuestionCard";

/**
 * PinnedQuestionsPanel renders only questions marked with status 'pinned'.
 * Placed above QuestionList to keep active pinned questions prominently displayed.
 */
export const PinnedQuestionsPanel = ({ mode = "audience" }) => {
  const { questions } = useEvent();

  // Filter strictly for pinned questions
  const pinnedQuestions = questions.filter(
    (q) => q.status === "pinned" || q.isPinned === true,
  );

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
              <QuestionCard question={question} mode={mode} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PinnedQuestionsPanel;
