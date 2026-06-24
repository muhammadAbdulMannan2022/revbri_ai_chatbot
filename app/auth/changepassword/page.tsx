"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useResetPasswordMutation } from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errorUtils";

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  interface ChangePasswordData {
    newPassword: string;
    confirmNewPassword: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as ChangePasswordData;

    if (data.newPassword !== data.confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!email) {
      setError("Unable to reset password without email.");
      return;
    }

    try {
      await resetPassword({ email, new_password: data.newPassword }).unwrap();
      router.push("/auth/login");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white px-4 py-8 select-none">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight text-center mb-12">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Lock size={16} />
              </span>
              <input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm placeholder-gray-300 shadow-sm transition-all ${
                  error ? "border-red-500" : "border-gray-200"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Lock size={16} />
              </span>
              <input
                name="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm placeholder-gray-300 shadow-sm transition-all ${
                  error ? "border-red-500" : "border-gray-200"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full hover:cursor-pointer disabled:opacity-60 bg-[#FF6F6F] hover:bg-[#ff5959] text-white font-medium py-3.5 rounded-lg transition-all duration-200 shadow-sm shadow-red-100 active:scale-[0.99] text-sm tracking-wide mt-4"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6F6F] border-t-transparent" />
      </div>
    }>
      <ChangePasswordContent />
    </Suspense>
  );
}
