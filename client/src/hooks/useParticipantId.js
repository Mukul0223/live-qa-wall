/**
 * Utility/Hook to retrieve or generate a session-persistent anonymous participant ID.
 *
 * NOTE: Intentionally uses `sessionStorage` (not `localStorage`) to maintain an anonymous, per-session identifier. Clearing browser session storage resets
 * the identifier, which is an accepted trade-off for unauthenticated audience tracking.
 */

const PARTICIPANT_KEY = "live_qa_participant_id";

export const getParticipantId = () => {
  // 1. Check if an ID is already stored for this browser session
  let participantId = sessionStorage.getItem(PARTICIPANT_KEY);

  // 2. If not found, generate a new UUID and persist it in sessionStorage
  if (!participantId) {
    participantId = crypto.randomUUID();
    sessionStorage.setItem(PARTICIPANT_KEY, participantId);
  }

  return participantId;
};

export const useParticipantId = () => {
  return getParticipantId();
};

export default getParticipantId;
