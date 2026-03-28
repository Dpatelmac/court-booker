import type { Booking } from "../types";

interface Props {
  booking: Booking | null;
  playerName: string;
  onBook: () => void;
}

export default function TimeSlotCell({ booking, playerName, onBook }: Props) {
  if (!booking) {
    return (
      <td className="slot slot-available" onClick={onBook}>
        Open
      </td>
    );
  }

  if (booking.playerName === playerName) {
    return <td className="slot slot-mine">You</td>;
  }

  return <td className="slot slot-taken">{booking.playerName}</td>;
}
