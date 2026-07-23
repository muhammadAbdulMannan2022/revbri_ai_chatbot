"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail as setReduxEmail } from "@/lib/authSlice";
import { useGoogleLoginMutation } from "@/lib/authApi";

/**
 * /auth/google-pending
 *
 * Landing page after Google OAuth callback.
 * If backend authentication succeeded (status === success), stores tokens and routes to dashboard/admin.
 * If status === error, redirects to login/signup displaying the error message.
 * If status === pending, attempts client-side google-login call to backend and routes on success.
 */
function GooglePendingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [googleLogin] = useGoogleLoginMutation();
  const attemptedRef = useRef(false);

  useEffect(() => {
    const status = params.get("status") ?? "pending";
    const email = params.get("email") ?? "";
    const name = params.get("name") ?? "";
    const picture = params.get("picture") ?? "";
    const sub = params.get("sub") ?? "";
    const accessToken = params.get("access_token") ?? "";
    const refreshToken = params.get("refresh_token") ?? "";
    const idToken = params.get("id_token") ?? "";
    const role = params.get("role") ?? "normal";
    const userId = params.get("user_id") ?? "";
    const intent = params.get("intent") ?? "login";
    const errorMessage = params.get("error_message") ?? "";

    // 1. If backend returned an error directly
    if (status === "error" && errorMessage) {
      const target = intent === "register" ? "/auth" : "/auth/login";
      router.replace(
        `${target}?oauth_error=${encodeURIComponent(errorMessage)}&email=${encodeURIComponent(email)}`,
      );
      return;
    }

    if (!email) {
      router.replace("/auth/login?oauth_error=Missing Google account email");
      return;
    }

    if (status === "success" && accessToken) {
      // Login/Signup succeeded on server-side callback
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

    // 2. Client-side backend authentication attempt
    if (!attemptedRef.current && (idToken || accessToken)) {
      attemptedRef.current = true;
      googleLogin({
        id_token: idToken || undefined,
        access_token: accessToken || undefined,
      })
        .unwrap()
        .then((res: any) => {
          if (res?.success === false) {
            const errMsg = res?.message || res?.detail || "Google login failed";
            const target = intent === "register" ? "/auth" : "/auth/login";
            router.replace(
              `${target}?oauth_error=${encodeURIComponent(errMsg)}&email=${encodeURIComponent(email)}`,
            );
            return;
          }

          const data = res?.data || res;
          const token = data?.access || data?.access_token;
          const refresh = data?.refresh || data?.refresh_token;
          const userRole = data?.role || data?.userole || "normal";
          const uId = data?.user_id || data?.id;

          if (token) {
            localStorage.setItem("access_token", token);
            if (refresh) localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_role", userRole);
            if (uId) localStorage.setItem("user_id", String(uId));

            dispatch(setReduxEmail(email));

            if (userRole === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/dashboard");
            }
            return;
          }

          const errMsg = res?.message || res?.detail || "Backend did not return tokens";
          const target = intent === "register" ? "/auth" : "/auth/login";
          router.replace(
            `${target}?oauth_error=${encodeURIComponent(errMsg)}&email=${encodeURIComponent(email)}`,
          );
        })
        .catch((err) => {
          console.error("Client-side Google login error:", err);
          const errMsg =
            err?.data?.message ||
            err?.data?.detail ||
            err?.message ||
            "Google authentication error";
          const target = intent === "register" ? "/auth" : "/auth/login";
          router.replace(
            `${target}?oauth_error=${encodeURIComponent(errMsg)}&email=${encodeURIComponent(email)}`,
          );
        });
      return;
    }

    // Fallback storing profile
    localStorage.setItem("google_oauth_email", email);
    localStorage.setItem("google_oauth_name", name);
    localStorage.setItem("google_oauth_picture", picture);
    localStorage.setItem("google_oauth_sub", sub);
    localStorage.setItem("google_oauth_access_token", accessToken);
    localStorage.setItem("google_oauth_intent", intent);

    const target = intent === "register" ? "/auth" : "/auth/login";
    router.replace(
      `${target}?oauth_notice=backend_pending&email=${encodeURIComponent(email)}`,
    );
  }, [params, router, dispatch, googleLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF6F6F] border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">
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
