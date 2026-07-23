"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/lib/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail } from "@/lib/authSlice";
import { getErrorMessage } from "@/lib/errorUtils";
import { buildGoogleOAuthUrl } from "@/lib/googleOAuth";

function SignupFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam =
      searchParams.get("oauth_error") || searchParams.get("oauth_message");
    if (errorParam) {
      setFormError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  interface SignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as SignupData;

    if (data.password !== data.confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }

    try {
      await register({
        full_name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setEmail(data.email));
      router.push(
        `/auth/verifyOtp?email=${encodeURIComponent(data.email)}&from=register`,
      );
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-white px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Welcome</h1>
          <p className="mx-auto text-sm text-gray-500">
            TOTC has got more than 100k positive ratings
          </p>
        </div>

        {formError && (
          <div className="mb-6 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter here"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="user@mail.com"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#FF6F6F] py-3.5 font-semibold text-white transition hover:cursor-pointer hover:bg-[#ff5959] disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex w-full items-center justify-center text-xs font-medium tracking-wide text-gray-400">
          <span className="px-2">
            ................Or sign up with................
          </span>
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = buildGoogleOAuthUrl("register"))}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 shadow-sm transition hover:cursor-pointer hover:bg-gray-50 active:scale-[0.99]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-600">Google</span>
        </button>

        <p className="mt-6 text-sm font-medium text-gray-600">
          Already have account?{" "}
          <Link
            href="/auth/login"
            className="ml-1 rounded border border-red-200 px-3 py-1 text-xs font-semibold text-[#FF6F6F] transition hover:bg-red-50"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupForm() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-white py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6F6F] border-t-transparent" />
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
