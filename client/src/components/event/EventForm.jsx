/**
 * EventForm Component
 * Reusable form for creating and editing events. Accepts initial values,
 * submit handler, and submit button label as props.
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function EventForm({
  initialData = { title: "", description: "" },
  onSubmit,
  buttonText = "Create Event",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear validation error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.title.trim()) {
      setError("Event title is required.");
      return;
    }

    // Pass data back up to parent page handler
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Event Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Q3 All-Hands Q&A"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Event Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description{" "}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide context or guidelines for your audience..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {buttonText}
      </button>
    </form>
  );
}
