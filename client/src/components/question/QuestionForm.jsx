import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

/**
 * QuestionForm Component
 * Allows audience members to submit questions to the active event.
 *
 * @param {Object} props
 * @param {Function} props.onSubmitQuestion - Async handler function receiving the question content text
 * @param {boolean} props.isDisabled - Disables inputs if event is ended or submitting
 */
export const QuestionForm = ({ onSubmitQuestion, isDisabled = false }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const MAX_CHARS = 500;

  const handleChange = (e) => {
    setContent(e.target.value);
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      setValidationError("Please type a question before submitting.");
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      setValidationError(`Question cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");
      await onSubmitQuestion(trimmed);
      setContent(""); // Reset form on success
    } catch (err) {
      console.error("Error submitting question:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-lg">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h2>Ask a Question</h2>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={content}
            onChange={handleChange}
            placeholder={
              isDisabled
                ? "This event is no longer accepting questions."
                : "What would you like to ask?"
            }
            maxLength={MAX_CHARS}
            disabled={isDisabled || isSubmitting}
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-50 disabled:text-gray-400 resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
            {content.length}/{MAX_CHARS}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isDisabled || isSubmitting || !content.trim()}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? "Posting..." : "Ask Question"}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
