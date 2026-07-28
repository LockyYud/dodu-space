import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * libSQL client for the IELTS tracker.
 *
 * Local/self-host: set IELTS_DB_URL=file:./ielts.db (default below).
 * Hosted (Turso): set IELTS_DB_URL=libsql://... and IELTS_DB_AUTH_TOKEN=...
 * The SQL is identical either way — no code changes to migrate.
 */
const url = process.env.IELTS_DB_URL ?? "file:./ielts.db";
const authToken = process.env.IELTS_DB_AUTH_TOKEN;

const client = createClient(authToken ? { url, authToken } : { url });

export const db = drizzle(client, { schema });
export { schema };
