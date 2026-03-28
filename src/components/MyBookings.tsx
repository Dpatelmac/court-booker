import { useState, useEffect } from "react";
import { COURTS } from "../data/courts";
import type { Booking } from "../types";
import {
  getMyBookings,
  cancelBooking,
  formatDateShort,
  formatHour,
} from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const courtName = (courtId: string) =>
    COURTS.find((c) => c.id === courtId)?.name ?? courtId;

  return (
    <div>
      <h2>My Bookings</h2>
      {error && <p className="error-message">{error}</p>}
      {bookings === null ? (
        <p className="loading-message">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="empty-state">
          You have no bookings yet. Go to Courts to book a time slot.
        </p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-item">
              <div className="booking-info">
                <strong>{courtName(b.courtId)}</strong>
                <span>
                  {formatDateShort(b.date)} at {formatHour(b.startHour)}
                </span>
              </div>
              <button className="cancel-btn" onClick={() => handleCancel(b.id)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
