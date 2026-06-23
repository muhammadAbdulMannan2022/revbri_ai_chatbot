import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    refresh: string;
    access: string;
    role: string;
    user_id: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ProfileFeature {
  name: string;
  is_active: boolean;
}

export interface PricingPlan {
  id: number | null;
  plan_name: string;
  plan_type: string;
  price_per_member: string;
  billing_cycle: string;
  ai_query_limit: number;
  badge_label: string;
  features: ProfileFeature[];
  is_active: boolean;
}

export interface ProfileData {
  id: number;
  email: string;
  full_name: string;
  profile_image: string | null;
  role: string;
  pricing_plan: PricingPlan;
  is_verified: boolean;
  [key: string]: unknown;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
  [key: string]: unknown;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://4002-103-186-20-8.ngrok-free.app",
    prepareHeaders: (headers, { getState }) => {
      // 1. Bypass the ngrok warning page
      headers.set("ngrok-skip-browser-warning", "true");

      // 2. Handle your existing authorization logic
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    // credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<
      void,
      { full_name: string; email: string; password: string; role?: string }
    >({
      query: ({ role = "normal", ...body }) => ({
        url: "/api/accounts/register/",
        method: "POST",
        body: {
          ...body,
          role,
        },
      getProfile: builder.query<ProfileResponse, void>({
        query: () => ({
          url: "/api/accounts/profile/",
          method: "GET",
        }),
      }),
      updateProfile: builder.mutation<ProfileResponse, Partial<ProfileData>>({
        query: (body) => ({
          url: "/api/accounts/profile/",
          method: "PATCH",
          body,
        }),
      }),
      }),
    }),
    login: builder.mutation<
      LoginResponse,
      { email: string; password: string; role_type?: string }
    >({
      query: ({ role_type = "normal", ...body }) => ({
        url: "/api/accounts/login/",
        method: "POST",
        body: {
          ...body,
          role_type,
        },
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/api/accounts/forgot-password/",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<void, { email: string; otp: string }>({
      query: (body) => ({
        url: "/api/accounts/verify-otp/",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/api/accounts/resend-otp/",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { email: string; new_password: string }
    >({
      query: (body) => ({
        url: "/api/accounts/reset-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
