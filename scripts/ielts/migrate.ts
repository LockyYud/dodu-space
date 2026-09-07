import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
  const url = process.env.IELTS_DB_URL ?? "file:./ielts.db";
  const authToken = process.env.IELTS_DB_AUTH_TOKEN;

  // Say where we are about to write BEFORE writing. Running this against the
  // local file while `.env` points at Turso looks like success and leaves the
  // deployed app querying columns that do not exist.
  console.log(`→ Target database: ${url}`);
  if (!process.env.IELTS_DB_URL) {
    console.log(
      "  (IELTS_DB_URL is unset — falling back to the local file. If you meant\n" +
        "   the hosted database, check that .env is being loaded.)",
    );
  }

  const client = createClient(authToken ? { url, authToken } : { url });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`✓ Migrations applied to ${url}`);
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
