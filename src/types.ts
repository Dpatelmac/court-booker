export interface Court {
  id: string;
  name: string;
  surface: "Hard" | "Clay" | "Grass";
}

export interface Booking {
  id: string;
  courtId: string;
  date: string;
  startHour: number;
  playerName: string;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
