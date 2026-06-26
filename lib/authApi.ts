import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    refresh: string;
    access: string;
    role?: string;
    userole?: string;
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

export interface Product {
  id: number;
  name: string;
  product_type: string;
  link: string;
  description: string;
  is_published: boolean;
  product_price: string;
  product_image: string | null;
  created_at: string;
}

export interface Banner {
  id: number;
  image: string;
  expirey_date: string;
  is_active: boolean;
  active_count: number;
  title: string;
  created_at: string;
}

export interface ChatProduct {
  id: number;
  name: string;
  description: string;
  score: number | null;
  image: string;
  url: string;
  price?: string;
}

export interface ChatProductResponse {
  query: string;
  results: ChatProduct[];
}

export interface ChatMessage {
  id: number;
  room: number;
  sender: number;
  message: string;
  // ai_response is a plain string OR a product-search object
  ai_response: string | ChatProductResponse;
  created_at: string;
}

export interface KnowledgePdf {
  id: number;
  file: string;
  is_active: boolean;
}

export interface BlockQuery {
  id: number;
  word: string;
}

export interface AiSettings {
  id: number;
  ai_restriction: string;
  response_style: string;
  total_query_count: number;
  today_query_count: number;
  today_date: string;
  is_active: boolean;
}

export type AiSettingsPatch = Partial<Pick<AiSettings, "ai_restriction" | "response_style" | "is_active">>;

export interface UserNotification {
  id: number;
  user: number;
  title: string;
  notification_banner: string | null;
  select_audience: string[];
  description: string;
  is_read: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface UserNotificationResponse {
  success: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  results: UserNotification[];
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://39c4-103-186-20-8.ngrok-free.app",
    prepareHeaders: (headers, { getState }) => {
      // 1. Bypass the ngrok warning page
      headers.set("ngrok-skip-browser-warning", "true");

      // 2. Handle your existing authorization logic
      let token = (getState() as RootState).auth.token;
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("access_token");
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    // credentials: "include",
  }),
  tagTypes: ["Product", "Banner", "Email", "Notification", "Messages", "KnowledgePdf", "BlockQuery", "AiSettings", "UserNotification"],
  endpoints: (builder) => ({
    register: builder.mutation<
      void,
      { full_name: string; email: string; password: string; role?: string }
    >({
      query: ({ role = "normal", ...body }) => ({
        url: "/api/register/",
        method: "POST",
        body: {
          ...body,
          role,
        },
      }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/api/profile/",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation<ProfileResponse, FormData>({
      query: (body) => ({
        url: "/api/profile/",
        method: "PATCH",
        body,
      }),
    }),
    login: builder.mutation<
      LoginResponse,
      { email: string; password: string; role_type?: string }
    >({
      query: ({ role_type, ...body }) => ({
        url: "/api/login/",
        method: "POST",
        body: role_type ? { ...body, role_type } : body,
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/api/forgot-password/",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<void, { email: string; otp: string }>({
      query: (body) => ({
        url: "/api/verify-otp/",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/api/resend-otp/",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<void, { email: string; new_password: string }>({
      query: (body) => ({
        url: "/api/reset-password/",
        method: "POST",
        body,
      }),
    }),
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "/api/product-list/",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductDetail: builder.query<Product | Product[], number>({
      query: (id) => ({
        url: `/api/product-detail/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (body) => ({
        url: "/api/product-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/api/product-update-delete/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/product-update-delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getBanners: builder.query<Banner[] | any, void>({
      query: () => ({
        url: "/api/thumbnail-list/admin/",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),
    createBanner: builder.mutation<Banner, FormData>({
      query: (body) => ({
        url: "/api/thumbnail-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation<Banner, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/api/thumbnail-detail/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/thumbnail-detail/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
    getPosters: builder.query<Banner[] | any, void>({
      query: () => ({
        url: "/api/thumbnail-list/user/",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),
    getUsers: builder.query<any, void>({
      query: () => ({
        url: "/api/admin-user-list/",
        method: "GET",
      }),
    }),
    // get all chats
    getChats: builder.query<any, void>({
      query: () => ({
        url: "/api/chat-rooms-list/",
        method: "GET",
      }),
    }),
    getChatHistory: builder.query<ChatMessage[], number>({
      query: (roomId) => ({
        url: `/api/chat-details/${roomId}/`,
        method: "GET",
      }),
      providesTags: (result, error, roomId) => [
        { type: "Notification", id: `chat-${roomId}` },
      ],
    }),
    sendMessage: builder.mutation<
      {
        message: ChatMessage;
        ai_response: string | ChatProductResponse;
        result: string | ChatProductResponse;
      },
      { room?: number; message: string }
    >({
      query: (body) => ({
        url: "/api/send-message/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
    // ── Knowledge PDFs ─────────────────────────────────────────────────────────
    getKnowledgePdfs: builder.query<{ success: boolean; count: number; results: KnowledgePdf[] }, void>({
      query: () => ({ url: "/api/knowledge-pdf-list/", method: "GET" }),
      providesTags: ["KnowledgePdf"],
    }),
    createKnowledgePdf: builder.mutation<KnowledgePdf, FormData>({
      query: (body) => ({ url: "/api/knowledge-pdf-create/", method: "POST", body }),
      invalidatesTags: ["KnowledgePdf"],
    }),
    deleteKnowledgePdf: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/knowledge-pdf-delete/${id}/`, method: "DELETE" }),
      invalidatesTags: ["KnowledgePdf"],
    }),
    // ── Block Queries ──────────────────────────────────────────────────────────
    getBlockQueries: builder.query<{ count: number; next: string | null; previous: string | null; results: BlockQuery[] }, void>({
      query: () => ({ url: "/api/block-query-list/", method: "GET" }),
      providesTags: ["BlockQuery"],
    }),
    createBlockQuery: builder.mutation<BlockQuery, { word: string }>({
      query: (body) => ({ url: "/api/block-query-create/", method: "POST", body }),
      invalidatesTags: ["BlockQuery"],
    }),
    deleteBlockQuery: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/block-query-delete/${id}/`, method: "DELETE" }),
      invalidatesTags: ["BlockQuery"],
    }),
    // ── AI Settings ────────────────────────────────────────────────────────────
    getAiSettings: builder.query<AiSettings, void>({
      query: () => ({ url: "/api/ai-settings/", method: "GET" }),
      providesTags: ["AiSettings"],
    }),
    updateAiSettings: builder.mutation<AiSettings, AiSettingsPatch>({
      query: (body) => ({ url: "/api/ai-settings/", method: "PATCH", body }),
      invalidatesTags: ["AiSettings"],
    }),
    getEmails: builder.query<any, void>({
      query: () => ({
        url: "/api/email-list/",
        method: "GET",
      }),
    }),
    createEmail: builder.mutation<
      any,
      {
        set_date: string;
        set_time: string;
        user_time_zone?: string;
        select_audience: string[];
        is_repeated: boolean;
        repeated_type: string;
        describe_email: string;
        is_active: boolean;
      }
    >({
      query: (body) => ({
        url: "/api/email-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Email"],
    }),
    getEmailDetail: builder.query<any, number>({
      query: (id) => ({
        url: `/api/email-detail/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Email", id }],
    }),
    updateEmail: builder.mutation<any, { id: number; body: Partial<any> }>({
      query: ({ id, body }) => ({
        url: `/api/email-detail/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Email"],
    }),
    deleteEmail: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/email-detail/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Email"],
    }),
    getAdminNotificationsToUsers: builder.query<any, void>({
      query: () => ({
        url: "/api/admin-notification-list/",
        method: "GET",
      }),
    }),
    createNotification: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/notification-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotificationDetail: builder.query<any, number>({
      query: (id) => ({
        url: `/api/notification-detail/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Notification", id }],
    }),
    updateNotification: builder.mutation<
      any,
      { id: number; body: Partial<any> }
    >({
      query: ({ id, body }) => ({
        url: `/api/notification-detail/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/notification-detail/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    getUserNotifications: builder.query<UserNotificationResponse, void>({
      query: () => ({
        url: "/api/user-notification-list/",
        method: "GET",
      }),
      providesTags: ["UserNotification"],
    }),
    deleteUserNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/user-del-notification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserNotification"],
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
  useGetProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetPostersQuery,
  useGetUsersQuery,
  // chats
  useGetChatsQuery,
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useGetKnowledgePdfsQuery,
  useCreateKnowledgePdfMutation,
  useDeleteKnowledgePdfMutation,
  useGetBlockQueriesQuery,
  useCreateBlockQueryMutation,
  useDeleteBlockQueryMutation,
  useGetAiSettingsQuery,
  useUpdateAiSettingsMutation,
  useGetEmailsQuery,
  useCreateEmailMutation,
  useGetEmailDetailQuery,
  useUpdateEmailMutation,
  useDeleteEmailMutation,
  useGetAdminNotificationsToUsersQuery,
  useCreateNotificationMutation,
  useGetNotificationDetailQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useGetUserNotificationsQuery,
  useDeleteUserNotificationMutation,
} = authApi;
