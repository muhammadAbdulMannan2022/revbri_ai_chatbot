"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail } from "@/lib/authSlice";
import { getErrorMessage } from "@/lib/errorUtils";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      setFormError(getErrorMessage(error) || "Registration failed");
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white px-4 py-8 relative">
      {/* Absolute Back Button Routing to Home Page (/) */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition active:scale-95 shadow-sm"
          aria-label="Go to home page"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header Block Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome</h1>
          <p className="text-gray-500 text-sm mx-auto">
            TOTC has got more than 100k positive ratings
          </p>
        </div>

        {formError && (
          <div className="mb-6 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* 1. Full Name Entry Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <User size={18} />
              </span>
              <input
                name="name"
                type="text"
                placeholder="Enter here"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 placeholder-gray-400 transition"
                required
              />
            </div>
          </div>

          {/* 2. Email Address Entry Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 placeholder-gray-400 transition"
                required
              />
            </div>
          </div>

          {/* 3. Choose Password Entry Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 placeholder-gray-400 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 4. Retype Password Verification Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 placeholder-gray-400 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#FF6F6F] hover:bg-[#ff5959] text-white font-semibold py-3.5 rounded-xl transition shadow-sm mt-2"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center justify-center my-6 text-xs text-gray-400 font-medium tracking-wide select-none">
          <span className="px-2">
            ................Or Sign up with................
          </span>
        </div>

        {/* OAuth Google Authentication Button */}
        <button
          type="button"
          className="w-full border hover:cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2.5 transition active:scale-[0.99] shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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

        {/* Backwards Redirection Link */}
        <p className="mt-6 text-sm text-gray-600 font-medium">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="ml-1 px-3 py-1 border border-red-200 rounded text-[#FF6F6F] text-xs font-semibold hover:bg-red-50 transition inline-block"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
