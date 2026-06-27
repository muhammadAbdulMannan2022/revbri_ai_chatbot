/**
 * Builds the Google OAuth2 authorization URL.
 * The `state` param is echoed back by Google so we can tell login vs. signup apart.
 */
export function buildGoogleOAuthUrl(intent: "login" | "register"): string {
  const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!;

  // Must be registered in Google Cloud Console → Authorized redirect URIs
  const redirectUri = `${window.location.origin}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: intent, // "login" or "register" — used by callback
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
