import type { Court } from "../types";

interface Props {
  court: Court;
  onViewSchedule: (courtId: string) => void;
}

export default function CourtCard({ court, onViewSchedule }: Props) {
  const surfaceEmoji =
    court.surface === "Clay" ? "🟤" : court.surface === "Grass" ? "🟢" : "🔵";

  return (
    <div className="court-card">
      <div className="court-surface-badge">{surfaceEmoji} {court.surface}</div>
      <h3>{court.name}</h3>
      <button onClick={() => onViewSchedule(court.id)}>View Schedule</button>
    </div>
  );
}
