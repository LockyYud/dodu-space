"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createIeltsSessionToken,
  IELTS_SESSION_COOKIE,
  IELTS_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

function passwordMatches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  // Compare against a same-length buffer first so a length mismatch alone
  // can't short-circuit the comparison and leak timing information.
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const expected = process.env.IELTS_AUTH_PASSWORD;
  if (!expected || !process.env.IELTS_AUTH_SECRET) {
    return {
      error:
        "Server chưa cấu hình IELTS_AUTH_PASSWORD/IELTS_AUTH_SECRET (xem .env.example).",
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password || !passwordMatches(password, expected)) {
    return { error: "Sai mật khẩu." };
  }

  const store = await cookies();
  store.set(IELTS_SESSION_COOKIE, await createIeltsSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: IELTS_SESSION_MAX_AGE_SECONDS,
  });

  const next = String(formData.get("next") ?? "/ielts/today");
  redirect(isPrivatePath(next) ? next : "/ielts/today");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete({ name: IELTS_SESSION_COOKIE, path: "/" });
  store.delete({ name: IELTS_SESSION_COOKIE, path: "/ielts" });
  redirect("/ielts/login");
}

function isPrivatePath(value: string): boolean {
  return value.startsWith("/ielts") || value.startsWith("/quiz");
}
