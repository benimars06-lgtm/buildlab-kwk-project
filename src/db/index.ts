import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Your Neon database connection string comes from .env.local
// Get yours at https://neon.tech — it looks like:
// postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Check your .env.local file.\n" +
      "Need a database? Sign up free at https://neon.tech"
  );
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
