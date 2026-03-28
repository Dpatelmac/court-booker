import type { Booking, Court, AuthResponse, User } from "../types";
import { api, setToken, getToken, clearToken } from "./api";

// ─── Auth ───

export { setToken, getToken, clearToken };

export async function signup(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const res = await api.post<AuthResponse>("/api/auth/signup", {
    email,
    password,
    displayName,
  });
  setToken(res.token);
  return res.user;
}

export async function login(
  email: string,
  password: string
): Promise<User> {
  const res = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  setToken(res.token);
  return res.user;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    return await api.get<User>("/api/auth/me");
  } catch {
    clearToken();
    return null;
  }
}

export function logout(): void {
  clearToken();
}

// ─── Courts ───

export async function getCourts(): Promise<Court[]> {
  return api.get<Court[]>("/api/courts");
}

// ─── Bookings ───

export async function getBookingsForCourtAndWeek(
  courtId: string,
  weekDates: string[]
): Promise<Booking[]> {
  const dates = weekDates.join(",");
  const bookings = await api.get<Booking[]>(
    `/api/bookings?courtId=${courtId}&dates=${dates}`
  );
  // Normalize date from full ISO timestamp to YYYY-MM-DD
  return bookings.map((b) => ({ ...b, date: b.date.split("T")[0] }));
}

export async function createBooking(
  courtId: string,
  date: string,
  startHour: number
): Promise<Booking> {
  return api.post<Booking>("/api/bookings", { courtId, date, startHour });
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await api.del(`/api/bookings/${bookingId}`);
}

export async function getMyBookings(): Promise<Booking[]> {
  const bookings = await api.get<Booking[]>("/api/bookings/mine");
  return bookings.map((b) => ({ ...b, date: b.date.split("T")[0] }));
}

// ─── Date Utilities (unchanged) ───

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

export function getWeekDates(monday: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}
