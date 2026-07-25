import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: string | boolean;
  family_name?: string;
  given_name?: string;
  iss?: string;
  picture?: string;
  sub?: string;
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    return jsonError("Google sign-in is not configured.", 503);
  }

  let credential = "";
  try {
    const body = await request.json() as { credential?: unknown };
    credential = typeof body.credential === "string" ? body.credential : "";
  } catch {
    return jsonError("Google credential is required.", 400);
  }

  if (!credential || credential.length > 10_000) {
    return jsonError("Google credential is required.", 400);
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );
    if (!response.ok) return jsonError("Google could not verify this sign-in.", 401);

    const token = await response.json() as GoogleTokenInfo;
    const validIssuer = token.iss === "https://accounts.google.com" || token.iss === "accounts.google.com";
    const emailVerified = token.email_verified === true || token.email_verified === "true";
    if (!token.sub || !token.email || !token.given_name || token.aud !== googleClientId || !validIssuer || !emailVerified) {
      return jsonError("Google could not verify this sign-in.", 401);
    }

    return NextResponse.json({
      email: token.email,
      firstName: token.given_name,
      lastName: token.family_name ?? "",
      avatarUrl: token.picture,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to verify Google One Tap credential", error);
    return jsonError("Google sign-in is unavailable. Try again shortly.", 502);
  }
}
