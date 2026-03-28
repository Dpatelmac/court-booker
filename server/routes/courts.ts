import { Router, Request, Response } from "express";
import { sql } from "../db";

const router = Router();

// GET /api/courts
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await sql`SELECT id, name, surface FROM courts ORDER BY name`;
    res.json(rows);
  } catch (err) {
    console.error("Courts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
