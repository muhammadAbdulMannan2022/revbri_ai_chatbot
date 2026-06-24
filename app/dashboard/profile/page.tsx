"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Lock, Upload, X } from "lucide-react";
import {
  useGetProfileQuery,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errorUtils";

const AccountSettings: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    retype: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState<string>("");
  const [profileError, setProfileError] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.data) {
      setProfileForm((prev) => ({
        ...prev,
        full_name: data.data.full_name || "",
        email: data.data.email || "",
        profileImage: data.data.profile_image || "",
      }));
      setPreviewUrl(data.data.profile_image || null);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field: "current" | "new" | "retype") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProfileImageFile(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setProfileImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const body = new FormData();
    body.append("full_name", profileForm.full_name);
    body.append("email", profileForm.email);
    if (profileImageFile) {
      body.append("profile_image", profileImageFile);
    }

    try {
      await updateProfile(body).unwrap();
      setProfileMessage("Profile updated successfully.");
      refetch();
    } catch (err: unknown) {
      setProfileError(getErrorMessage(err));
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (profileForm.newPassword !== profileForm.retypePassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (!profileForm.email) {
      setPasswordError("Unable to reset password without email.");
      return;
    }

    const body = new FormData();
    body.append("email", profileForm.email);
    body.append("new_password", profileForm.newPassword);

    try {
      await resetPassword(body).unwrap();
      setPasswordMessage("Password updated successfully.");
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        retypePassword: "",
      }));
    } catch (err: unknown) {
      setPasswordError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen font-sans bg-white">
      <h1 className="text-3xl font-bold mb-2 text-gray-700">
        Account Settings
      </h1>
      <p className="text-gray-500 mb-8">
        Update your profile information and reset your password.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF6F6F] border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error)}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <form
            onSubmit={handleProfileSave}
            className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Personal Details
              </h2>
              <p className="text-sm text-gray-500">
                Update your profile name and email here.
              </p>
            </div>

            <div className="grid gap-5">
              <label className="block text-sm font-medium text-gray-700">
                Full name
                <input
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="mt-2 w-full p-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Email address
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="mt-2 w-full p-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Profile image
                </span>
                <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-md border-dashed">
                  {previewUrl ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No image available
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Upload size={16} className="inline-block mr-1" />
                    Upload image
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <p className="text-xs text-gray-400">
                  Image upload is preview-only here; actual profile-image
                  updates depend on your backend support.
                </p>
              </div>
            </div>

            {profileError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {profileError}
              </div>
            )}
            {profileMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {profileMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full rounded-xl bg-[#FF6F6F] px-5 py-3 text-white font-semibold shadow-sm transition hover:bg-[#ff5959] disabled:opacity-60"
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </form>

          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Account overview
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="mt-2 font-semibold text-gray-800">
                    {data?.data?.role ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Verified</p>
                  <p className="mt-2 font-semibold text-gray-800">
                    {data?.data?.is_verified ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="mt-2 font-semibold text-gray-800">
                    {data?.data?.pricing_plan?.plan_name ?? "None"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Queries limit</p>
                  <p className="mt-2 font-semibold text-gray-800">
                    {data?.data?.pricing_plan?.ai_query_limit ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Password Reset
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Set a new password for your account.
              </p>

              {[
                {
                  label: "Current password",
                  name: "currentPassword",
                  visibleKey: "current",
                },
                {
                  label: "New password",
                  name: "newPassword",
                  visibleKey: "new",
                },
                {
                  label: "Retype password",
                  name: "retypePassword",
                  visibleKey: "retype",
                },
              ].map((field) => (
                <label
                  key={field.name}
                  className="block text-sm font-medium text-gray-700 mb-4"
                >
                  {field.label}
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <Lock size={16} />
                    </span>
                    <input
                      name={field.name}
                      type={
                        showPassword[
                          field.visibleKey as keyof typeof showPassword
                        ]
                          ? "text"
                          : "password"
                      }
                      value={
                        profileForm[field.name as keyof typeof profileForm]
                      }
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200"
                      required={field.name !== "currentPassword"}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        toggleVisibility(
                          field.visibleKey as "current" | "new" | "retype",
                        )
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400"
                    >
                      {showPassword[
                        field.visibleKey as keyof typeof showPassword
                      ] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </label>
              ))}

              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                  {passwordError}
                </div>
              )}
              {passwordMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 mb-4">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isResetting}
                className="rounded-xl bg-white border border-red-400 px-5 py-3 text-red-500 font-semibold shadow-sm transition hover:bg-red-50 disabled:opacity-60"
              >
                {isResetting ? "Updating password..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
