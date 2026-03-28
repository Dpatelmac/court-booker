import { COURTS } from "../data/courts";
import CourtCard from "./CourtCard";

interface Props {
  onViewSchedule: (courtId: string) => void;
}

export default function CourtList({ onViewSchedule }: Props) {
  return (
    <div>
      <h2>Tennis Courts</h2>
      <div className="court-grid">
        {COURTS.map((court) => (
          <CourtCard
            key={court.id}
            court={court}
            onViewSchedule={onViewSchedule}
          />
        ))}
      </div>
    </div>
  );
}
