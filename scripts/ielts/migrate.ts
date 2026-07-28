import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
  const url = process.env.IELTS_DB_URL ?? "file:./ielts.db";
  const authToken = process.env.IELTS_DB_AUTH_TOKEN;
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
