import type { User } from "../types";

interface Props {
  currentView: string;
  onNavigate: (view: "courts" | "myBookings") => void;
  user: User;
  onLogout: () => void;
}

export default function NavBar({ currentView, onNavigate, user, onLogout }: Props) {
  return (
    <nav className="navbar">
      <div className="nav-brand">Court Booker</div>
      <div className="nav-links">
        <button
          className={currentView === "courts" ? "active" : ""}
          onClick={() => onNavigate("courts")}
        >
          Courts
        </button>
        <button
          className={currentView === "myBookings" ? "active" : ""}
          onClick={() => onNavigate("myBookings")}
        >
          My Bookings
        </button>
      </div>
      <div className="nav-user">
        <span>{user.displayName}</span>
        <button className="logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
