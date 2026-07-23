import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/callback/google
 *
 * Google redirects here with ?code=...&state=...
 * 1. Exchanges authorization code for Google tokens (id_token, access_token).
 * 2. Fetches user's Google profile (email, name, picture, sub).
 * 3. Redirects to /auth/google-pending so the client browser executes the POST to /api/google-login/.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? "login";
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/auth/login?oauth_error=${encodeURIComponent(error ?? "no_code")}`,
    );
  }

  try {
    // 1. Exchange code for Google tokens
    const redirectUri = `${origin}/api/auth/callback/google`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:
          process.env.OAUTH_CLIENT_ID ||
          process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID ||
          "",
        client_secret: process.env.OAUTH_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokens: { access_token: string; id_token: string } =
      await tokenRes.json();

    // 2. Fetch Google user profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );

    if (!profileRes.ok) {
      throw new Error(`Profile fetch failed: ${profileRes.status}`);
    }

    const profile: {
      email: string;
      name: string;
      picture: string;
      sub: string;
    } = await profileRes.json();

    // 3. Redirect to /auth/google-pending for client-side /api/google-login/ call
    const pendingUrl = new URL(`${origin}/auth/google-pending`);
    pendingUrl.searchParams.set("email", profile.email || "");
    pendingUrl.searchParams.set("name", profile.name || "");
    pendingUrl.searchParams.set("picture", profile.picture || "");
    pendingUrl.searchParams.set("sub", profile.sub || "");
    pendingUrl.searchParams.set("intent", state);
    pendingUrl.searchParams.set("id_token", tokens.id_token || "");
    pendingUrl.searchParams.set("access_token", tokens.access_token || "");
    pendingUrl.searchParams.set("status", "pending");

    return NextResponse.redirect(pendingUrl.toString());
  } catch (err: any) {
    console.error("[google-oauth-callback]", err);
    return NextResponse.redirect(
      `${origin}/auth/login?oauth_error=${encodeURIComponent(err?.message || "callback_failed")}`,
    );
  }
}
