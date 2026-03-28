import { useState, useEffect } from "react";
import type { User } from "./types";
import { getCurrentUser, logout } from "./services/bookingService";
import NavBar from "./components/NavBar";
import AuthForm from "./components/AuthForm";
import CourtList from "./components/CourtList";
import WeeklySchedule from "./components/WeeklySchedule";
import MyBookings from "./components/MyBookings";

type View = "courts" | "schedule" | "myBookings";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentView, setCurrentView] = useState<View>("courts");
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthChecked(true);
    });
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView("courts");
    setSelectedCourtId(null);
  };

  const handleViewSchedule = (courtId: string) => {
    setSelectedCourtId(courtId);
    setCurrentView("schedule");
  };

  const handleBackToCourts = () => {
    setCurrentView("courts");
    setSelectedCourtId(null);
  };

  if (!authChecked) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={setUser} />;
  }

  return (
    <div className="app">
      <NavBar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === "courts") setSelectedCourtId(null);
        }}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {currentView === "courts" && (
          <CourtList onViewSchedule={handleViewSchedule} />
        )}
        {currentView === "schedule" && selectedCourtId && (
          <WeeklySchedule
            courtId={selectedCourtId}
            user={user}
            onBack={handleBackToCourts}
          />
        )}
        {currentView === "myBookings" && <MyBookings />}
      </main>
    </div>
  );
}
