import { defineConfig } from "drizzle-kit";

/**
 * Drizzle config for the IELTS tracker (libSQL / SQLite).
 * Migrations live in ./drizzle. See docs/ielts/TECH-DESIGN.md §2.
 */
export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/ielts/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.IELTS_DB_URL ?? "file:./ielts.db",
    authToken: process.env.IELTS_DB_AUTH_TOKEN,
  },
});
