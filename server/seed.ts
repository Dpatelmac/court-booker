import { readFileSync } from "fs";
import { resolve } from "path";
import { sql } from "./db.js";

async function seed() {
  const schemaPath = resolve(import.meta.dirname, "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  console.log("Running schema against Neon...");

  // Split schema into individual statements and run each one
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log("Database setup complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
