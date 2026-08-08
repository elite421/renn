import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "renn@4546";
const AUTH_COOKIE_NAME = "renn_admin_token";
const AUTH_SECRET_VALUE = "renn_authenticated_admin_session_token_2026";

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getHardcodedPassword(): string {
  return ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_SECRET_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}
