import "dotenv/config";
import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load .env.local (Next.js convention) so drizzle-kit can read DATABASE_URL
config({ path: ".env.local" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
