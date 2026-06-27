"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail as setReduxEmail } from "@/lib/authSlice";

/**
 * /auth/google-pending
 *
 * Landing page after Google OAuth callback.
 * If backend authentication succeeded (status === success), stores tokens and routes to dashboard/admin.
 * Otherwise, falls back to storing Google profile in localStorage with a pending notice.
 */
function GooglePendingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const status = params.get("status") ?? "pending";
    const email = params.get("email") ?? "";
    const name = params.get("name") ?? "";
    const picture = params.get("picture") ?? "";
    const sub = params.get("sub") ?? "";
    const accessToken = params.get("access_token") ?? "";
    const refreshToken = params.get("refresh_token") ?? "";
    const role = params.get("role") ?? "normal";
    const userId = params.get("user_id") ?? "";
    const intent = params.get("intent") ?? "login";

    if (!email) {
      router.replace("/auth/login?oauth_error=missing_profile");
      return;
    }

    if (status === "success" && accessToken) {
      // Login/Signup succeeded on the Django backend!
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      localStorage.setItem("user_role", role);
      if (userId) {
        localStorage.setItem("user_id", userId);
      }
      
      dispatch(setReduxEmail(email));

      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    // Fallback: Django backend logic not yet added, store profile for manual check
    localStorage.setItem("google_oauth_email", email);
    localStorage.setItem("google_oauth_name", name);
    localStorage.setItem("google_oauth_picture", picture);
    localStorage.setItem("google_oauth_sub", sub);
    localStorage.setItem("google_oauth_access_token", accessToken);
    localStorage.setItem("google_oauth_intent", intent);

    // Redirect back to login/register until backend is wired up
    const target = intent === "register" ? "/auth" : "/auth/login";
    router.replace(
      `${target}?oauth_notice=backend_pending&email=${encodeURIComponent(email)}`,
    );
  }, [params, router, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF6F6F] border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">
          Completing Google sign-in…
        </p>
      </div>
    </div>
  );
}

export default function GooglePendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF6F6F] border-t-transparent" />
        </div>
      }
    >
      <GooglePendingContent />
    </Suspense>
  );
}
