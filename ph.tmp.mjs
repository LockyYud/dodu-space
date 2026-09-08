import { createClient } from "@libsql/client";
const c = createClient({ url: "file:./ielts.db" });
await c.execute("update phase_state set phase='build' where completed_on is null");
console.log("phase -> build");
