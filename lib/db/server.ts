import { Pool } from "pg";

let pool: Pool | null = null;

export function getServerDbPool() {
  const connectionString = process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error("Missing required environment variable: SUPABASE_DB_URL");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
    });
  }

  return pool;
}
