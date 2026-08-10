import { cookies } from "next/headers";
import { IELTS_SESSION_COOKIE, verifyIeltsSessionToken } from "./session";

/**
 * Call at the top of every mutating/LLM-calling Server Action under
 * `/ielts`. `middleware.ts` already blocks page loads, but a Server
 * Action is a separate POST endpoint — this is the same check enforced
 * at the action layer so it can't be reached by bypassing the page.
 */
export async function requireIeltsUser(): Promise<void> {
  const store = await cookies();
  const ok = await verifyIeltsSessionToken(
    store.get(IELTS_SESSION_COOKIE)?.value,
  );
  if (!ok) {
    throw new Error("Unauthorized: cần đăng nhập /ielts.");
  }
}
