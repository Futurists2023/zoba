import { Pool } from "pg";

let pool: Pool | null = null;

export function getServerDbPool() {
  const connectionString = process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error("Missing required environment variable: SUPABASE_DB_URL");
  }

  if (connectionString.includes("[YOUR-PASSWORD]")) {
    throw new Error("SUPABASE_DB_URL still contains the placeholder password.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    });
  }

  return pool;
}
