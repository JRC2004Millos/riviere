"use server";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

// In-memory rate limiter — resets on server restart, válido para single-server
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

async function getIp(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const ip = await getIp();

  if (isRateLimited(ip)) {
    return "Demasiados intentos. Espera 15 minutos.";
  }

  const password = (formData.get("password") as string) ?? "";
  if (password.length > 128) {
    recordFailure(ip);
    return "Credenciales inválidas.";
  }

  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password,
      redirectTo: "/admin",
    });
    // Login exitoso — limpiar intentos
    attempts.delete(ip);
  } catch (error) {
    if (error instanceof AuthError) {
      recordFailure(ip);
      return "Credenciales inválidas.";
    }
    throw error; // rethrow NEXT_REDIRECT
  }
}
