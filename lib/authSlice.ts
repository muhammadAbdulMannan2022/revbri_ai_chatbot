import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { getErrorMessage } from "./errorUtils";

export interface AuthState {
  email: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  token: string | null;
  user: unknown;
}

const initialState: AuthState = {
  email: "",
  status: "idle",
  error: null,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    logout(state) {
      state.email = "";
      state.status = "idle";
      state.error = null;
      state.token = null;
      state.user = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      })
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const accessToken =
          action.payload?.data?.access ||
          action.payload?.access ||
          action.payload?.token;
        if (accessToken) {
          state.token = accessToken;
        }
        state.user =
          action.payload?.data ?? action.payload?.user ?? action.payload;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error) || "Login failed.";
      })
      .addMatcher(authApi.endpoints.forgotPassword.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.forgotPassword.matchFulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.forgotPassword.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            getErrorMessage(action.error) || "Forgot password request failed.";
        },
      )
      .addMatcher(authApi.endpoints.verifyOtp.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verifyOtp.matchFulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.verifyOtp.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            getErrorMessage(action.error) || "OTP verification failed.";
        },
      )
      .addMatcher(authApi.endpoints.getProfile.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload?.data ?? action.payload;
      })
      .addMatcher(
        authApi.endpoints.getProfile.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            getErrorMessage(action.error) || "Could not load profile.";
        },
      )
      .addMatcher(authApi.endpoints.resetPassword.matchPending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.resetPassword.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            getErrorMessage(action.error) || "Password reset failed.";
        },
      );
  },
});

export const { setEmail, setToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
