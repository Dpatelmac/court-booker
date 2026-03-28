import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sql } from "../db";
import { authenticate, signToken } from "../middleware/auth";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      res.status(400).json({ message: "Email, password, and display name are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rows = await sql`
      INSERT INTO users (email, password_hash, display_name)
      VALUES (${email}, ${passwordHash}, ${displayName})
      RETURNING id, email, display_name
    `;

    const user = { id: rows[0].id, email: rows[0].email, displayName: rows[0].display_name };
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const rows = await sql`
      SELECT id, email, password_hash, display_name FROM users WHERE email = ${email}
    `;

    if (rows.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const user = { id: rows[0].id, email: rows[0].email, displayName: rows[0].display_name };
    const token = signToken(user);

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, (req: Request, res: Response) => {
  res.json(req.user);
});

export default router;
