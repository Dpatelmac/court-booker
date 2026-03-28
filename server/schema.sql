CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courts (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  surface TEXT NOT NULL CHECK (surface IN ('Hard', 'Clay', 'Grass'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  court_id   TEXT NOT NULL REFERENCES courts(id),
  date       DATE NOT NULL,
  start_hour INTEGER NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(court_id, date, start_hour)
);

INSERT INTO courts (id, name, surface) VALUES
  ('court-1', 'Court 1', 'Hard'),
  ('court-2', 'Court 2', 'Clay'),
  ('court-3', 'Court 3', 'Hard'),
  ('court-4', 'Court 4', 'Grass')
ON CONFLICT (id) DO NOTHING;
