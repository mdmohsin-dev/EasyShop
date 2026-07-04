import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function getSession(request: NextRequest) {
  return auth.api.getSession({ headers: request.headers });
}

/**
 * Returns the session if the caller is a logged-in admin, otherwise returns
 * a NextResponse (401/403) that the caller should return immediately.
 * Always re-check the role from the DB-backed session — never trust a role
 * sent in the request body.
 */
export async function requireAdmin(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { session, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, error: null };
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
