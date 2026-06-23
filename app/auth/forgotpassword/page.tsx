"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import BackButton from "@/lib/BackButton";
import { useForgotPasswordMutation } from "@/lib/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setEmail } from "@/lib/authSlice";
import { getErrorMessage } from "@/lib/errorUtils";

export default function ForgotPassword() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const dispatch = useAppDispatch();

  interface ForgotPasswordData {
    email: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as ForgotPasswordData;

    if (!data.email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPassword({ email: data.email }).unwrap();
      dispatch(setEmail(data.email));
      router.push(
        `/auth/verifyOtp?email=${encodeURIComponent(data.email)}&from=forgot`,
      );
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white px-4 py-8 select-none relative">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-wide mb-3">
            Forgot Password
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-72.5 sm:max-w-xs mx-auto leading-relaxed">
            Enter your email address below and we will send you an activation
            code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Mail size={18} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="user@mail.com"
                className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm placeholder-gray-300 transition-all ${
                  error ? "border-red-500" : "border-gray-200"
                }`}
                required
              />
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
            className="w-full hover:cursor-pointer disabled:opacity-60 bg-[#FF6F6F] hover:bg-[#ff5959] text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-sm shadow-red-100 active:scale-[0.99] text-sm tracking-wide"
          >
            {isLoading ? "Sending code..." : "Send Verification Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
