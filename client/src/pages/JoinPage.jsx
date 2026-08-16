/**
 * JoinPage allows audience members to enter a 6-digit event code,
 * set an optional nickname, and navigate into the live Event Room.
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hash, User, ArrowRight, Radio } from "lucide-react";
import { joinEventByCode } from "../api/event.api";

/**
 * JoinPage allows audience members to enter a 6-digit event code,
 * set an optional nickname, and navigate into the live Event Room.
 */
const JoinPage = () => {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(urlCode?.trim() || "");
  const [nickname, setNickname] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear validation error when user starts editing inputs
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (validationError) setValidationError("");
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== API RESPONSE FROM JOIN ===", e);

    const cleanCode = code.trim();

    // Client-side validation: must be exactly 6 digits
    if (!/^\d{6}$/.test(cleanCode)) {
      setValidationError("Please enter a valid 6-digit numeric code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");

      // Look up event by code via event.api.js
      const event = await joinEventByCode(cleanCode);

      // Store nickname in sessionStorage (or default to empty/Anonymous)
      if (nickname.trim()) {
        sessionStorage.setItem("live_qa_nickname", nickname.trim());
      } else {
        sessionStorage.removeItem("live_qa_nickname");
      }

      // Navigate to the Event Room using the retrieved event ID
      navigate(`/event/${event._id}`);
    } catch (err) {
      // Failure is caught here; global Toast handles API error messages.
      console.error("Failed to join event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      {/* Card container matching Login & Register styling */}
      <div className="bg-white px-8 py-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        {/* Top Badge/Icon */}
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Header Section */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Join an Event
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500 mb-8">
          Enter the 6-digit code provided by your host to join the live Q&A.
        </p>

        {/* Client-side validation error banner */}
        {validationError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Code Input */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Event Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                id="code"
                type="text"
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                placeholder="e.g. 123456"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base font-semibold tracking-widest disabled:bg-gray-100 placeholder:font-normal placeholder:tracking-normal"
                required
              />
            </div>
          </div>

          {/* Nickname Input */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Your Nickname{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="Leave blank for Anonymous"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSubmitting ? "Joining..." : "Join Event"}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinPage;
