import { useState, useEffect, useCallback } from "react";
import type { Booking, User } from "../types";
import { COURTS } from "../data/courts";
import {
  getMonday,
  getWeekDates,
  formatDateShort,
  formatHour,
  getBookingsForCourtAndWeek,
  createBooking,
} from "../services/bookingService";
import TimeSlotCell from "./TimeSlotCell";

interface Props {
  courtId: string;
  user: User;
  onBack: () => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export default function WeeklySchedule({ courtId, user, onBack }: Props) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  const court = COURTS.find((c) => c.id === courtId);
  const weekDates = getWeekDates(weekStart);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getBookingsForCourtAndWeek(courtId, weekDates);
      setBookings(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load schedule");
    }
  }, [courtId, weekDates.join(",")]);

  useEffect(() => {
    setBookings(null);
    fetchBookings();
  }, [fetchBookings]);

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleBook = async (date: string, hour: number) => {
    try {
      await createBooking(courtId, date, hour);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || "Failed to book slot");
    }
  };

  const getSlotBooking = (date: string, hour: number): Booking | null => {
    return bookings?.find((b) => b.date === date && b.startHour === hour) ?? null;
  };

  return (
    <div>
      <div className="schedule-header">
        <button className="back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>{court?.name} Schedule</h2>
        <div className="week-nav">
          <button onClick={handlePrevWeek}>&lsaquo;</button>
          <span>
            {formatDateShort(weekDates[0])} &ndash;{" "}
            {formatDateShort(weekDates[6])}
          </span>
          <button onClick={handleNextWeek}>&rsaquo;</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {bookings === null ? (
        <p className="loading-message">Loading schedule...</p>
      ) : (
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                {weekDates.map((date) => (
                  <th key={date}>{formatDateShort(date)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="hour-label">{formatHour(hour)}</td>
                  {weekDates.map((date) => (
                    <TimeSlotCell
                      key={`${date}-${hour}`}
                      booking={getSlotBooking(date, hour)}
                      playerName={user.displayName}
                      onBook={() => handleBook(date, hour)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="schedule-legend">
        <span className="legend-item">
          <span className="legend-dot available"></span> Available
        </span>
        <span className="legend-item">
          <span className="legend-dot mine"></span> Your booking
        </span>
        <span className="legend-item">
          <span className="legend-dot taken"></span> Taken
        </span>
      </div>
    </div>
  );
}
