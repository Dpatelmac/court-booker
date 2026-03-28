import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import courtRoutes from "./routes/courts.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
