import { Router, Request, Response } from "express";
import { sql } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// GET /api/bookings?courtId=X&dates=2026-03-24,2026-03-25,...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { courtId, dates } = req.query;

    if (!courtId || !dates) {
      res.status(400).json({ message: "courtId and dates query params are required" });
      return;
    }

    const dateArray = (dates as string).split(",");

    const rows = await sql`
      SELECT b.id, b.court_id AS "courtId", b.date, b.start_hour AS "startHour",
             u.display_name AS "playerName"
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.court_id = ${courtId} AND b.date = ANY(${dateArray}::date[])
      ORDER BY b.date, b.start_hour
    `;

    res.json(rows);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/mine
router.get("/mine", async (req: Request, res: Response) => {
  try {
    const rows = await sql`
      SELECT b.id, b.court_id AS "courtId", b.date, b.start_hour AS "startHour",
             u.display_name AS "playerName"
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.user_id = ${req.user!.id}
      ORDER BY b.date, b.start_hour
    `;

    res.json(rows);
  } catch (err) {
    console.error("Get my bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/bookings
router.post("/", async (req: Request, res: Response) => {
  try {
    const { courtId, date, startHour } = req.body;

    if (!courtId || !date || startHour === undefined) {
      res.status(400).json({ message: "courtId, date, and startHour are required" });
      return;
    }

    const rows = await sql`
      INSERT INTO bookings (court_id, date, start_hour, user_id)
      VALUES (${courtId}, ${date}, ${startHour}, ${req.user!.id})
      RETURNING id, court_id AS "courtId", date, start_hour AS "startHour"
    `;

    const booking = { ...rows[0], playerName: req.user!.displayName };
    res.status(201).json(booking);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ message: "This time slot is already booked" });
      return;
    }
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/bookings/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await sql`
      DELETE FROM bookings WHERE id = ${req.params.id} AND user_id = ${req.user!.id}
      RETURNING id
    `;

    if (rows.length === 0) {
      res.status(404).json({ message: "Booking not found or not yours" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
