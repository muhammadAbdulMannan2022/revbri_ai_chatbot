import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/callback/google
 *
 * Google redirects here with ?code=...&state=...
 *
 * Current behaviour (placeholder):
 *   - Exchanges the code for Google tokens
 *   - Fetches the user's Google profile
 *   - Redirects to /auth/google-pending with profile data as query params
 *     so the frontend can pass them to your Django backend when ready.
 *
 * TODO (backend): replace the redirect with a call to your Django endpoint
 * that accepts the google id_token or access_token and returns JWT pairs.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? "login"; // "login" | "register"
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/auth/login?oauth_error=${encodeURIComponent(error ?? "no_code")}`,
    );
  }

  try {
    // ── 1. Exchange code for tokens ──────────────────────────────────────
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

    // ── 2. Fetch Google user profile ─────────────────────────────────────
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

    // ── 3. Call your Django backend ──────────────────────────────────────
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://revri.duckdns.org";
    let backendSuccess = false;
    let backendTokens: {
      access?: string;
      refresh?: string;
      role?: string;
      userole?: string;
      user_id?: number;
    } = {};
    let backendErrorMessage = "";

    try {
      const backendRes = await fetch(`${backendUrl}/api/google-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          id_token: tokens.id_token,
          access_token: tokens.access_token,
        }),
      });

      const resData = await backendRes.json();

      if (backendRes.ok && resData.success !== false) {
        if (resData.success && resData.data) {
          backendSuccess = true;
          backendTokens = resData.data;
        } else if (resData.access || resData.refresh || resData.tokens?.access) {
          backendSuccess = true;
          backendTokens = resData.tokens || resData;
        } else {
          backendErrorMessage =
            resData.message || resData.detail || "Google login failed";
        }
      } else {
        backendErrorMessage =
          resData?.message ||
          resData?.detail ||
          resData?.error ||
          `Google authentication failed (Status ${backendRes.status})`;
      }
    } catch (err: any) {
      console.warn(
        "Django backend google-login connection failed.",
        err,
      );
      backendErrorMessage = err?.message || "";
    }

    // ── 4. Redirect with results or fallback to pending ───────────────────
    const pendingUrl = new URL(`${origin}/auth/google-pending`);
    pendingUrl.searchParams.set("email", profile.email || "");
    pendingUrl.searchParams.set("name", profile.name || "");
    pendingUrl.searchParams.set("picture", profile.picture || "");
    pendingUrl.searchParams.set("sub", profile.sub || "");
    pendingUrl.searchParams.set("intent", state);
    pendingUrl.searchParams.set("id_token", tokens.id_token || "");

    if (backendSuccess && backendTokens.access) {
      pendingUrl.searchParams.set("status", "success");
      pendingUrl.searchParams.set("access_token", backendTokens.access);
      pendingUrl.searchParams.set("refresh_token", backendTokens.refresh || "");
      pendingUrl.searchParams.set("role", backendTokens.role || backendTokens.userole || "normal");
      pendingUrl.searchParams.set("user_id", String(backendTokens.user_id || ""));
    } else if (backendErrorMessage) {
      pendingUrl.searchParams.set("status", "error");
      pendingUrl.searchParams.set("error_message", backendErrorMessage);
    } else {
      pendingUrl.searchParams.set("status", "pending");
      pendingUrl.searchParams.set("access_token", tokens.access_token);
    }

    return NextResponse.redirect(pendingUrl.toString());
  } catch (err) {
    console.error("[google-oauth-callback]", err);
    return NextResponse.redirect(
      `${origin}/auth/login?oauth_error=callback_failed`,
    );
  }
}
