import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth";
import courtRoutes from "./routes/courts";
import bookingRoutes from "./routes/bookings";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
