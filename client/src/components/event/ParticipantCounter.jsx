import { Users } from "lucide-react";
import { useEvent } from "../../hooks/useEvent";

/**
 * Displays live count of active audience participants in an event room.
 */
export const ParticipantCounter = () => {
  const { participantCount } = useEvent();

  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      <Users className="h-3.5 w-3.5" />
      <span>
        {participantCount}{" "}
        {participantCount === 1 ? "participant" : "participants"}
      </span>
    </div>
  );
};

export default ParticipantCounter;
