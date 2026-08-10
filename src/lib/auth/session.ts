/**
 * Signed session token for the `/ielts` area only.
 *
 * Deliberately edge/runtime-agnostic (Web Crypto + `btoa`, no `Buffer`,
 * no `node:crypto`) so the exact same verify path runs in `middleware.ts`
 * (edge) and in Server Actions (node) without a runtime split.
 */
export const IELTS_SESSION_COOKIE = "ielts_session";
export const IELTS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.IELTS_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "IELTS_AUTH_SECRET chưa được cấu hình — bắt buộc để bảo vệ /ielts.",
    );
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = Array.from(new Uint8Array(bytes), (b) =>
    String.fromCharCode(b),
  ).join("");
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  return toBase64Url(sig);
}

/** `<expiresAtMs>.<signature>` — no server-side session store needed. */
export async function createIeltsSessionToken(): Promise<string> {
  const expiresAt = Date.now() + IELTS_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyIeltsSessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if ((await hmac(payload)) !== sig) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}
