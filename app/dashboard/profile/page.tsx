"use client";
import React, { useRef, useState } from "react";
import { Lock, Eye, EyeOff, Upload, X } from "lucide-react";

const AccountSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "Program All Test",
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    retype: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field: "current" | "new" | "retype") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen font-sans bg-white">
      <h1 className="text-3xl font-bold mb-2 text-gray-700">
        Account Settings
      </h1>
      <p className="text-gray-500 mb-8">
        Here will be some dummy text from loreum ipsum.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Personal Details & Delete Account */}
        <div className="flex flex-col gap-8">
          {/* Personal Details Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              Personal Details
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name <span className="text-red-400">*</span>
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full p-3 bg-gray-50 border text-black border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-md border-dashed">
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-200"
                  >
                    <Upload size={16} /> Upload image
                  </button>
                )}
                <span className="text-gray-400 text-sm">Add your image</span>
              </div>
            </div>

            <button className="px-10 py-2 border hover:cursor-pointer border-red-400 text-red-400 rounded hover:bg-red-50 font-medium">
              Save
            </button>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Delete Account
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              If you delete your account, your personal information will be
              wiped from Coursera's servers, all of you anonymized and any
              certificates earned will be deleted. This action cannot be undone!
            </p>
            <button className="px-4 py-2 hover:cursor-pointer border border-red-400 text-red-400 rounded hover:bg-red-50 text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Column: Password Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Password Settings
          </h2>
          {[
            {
              label: "Current password",
              key: "currentPassword",
              state: "current",
            },
            { label: "New password", key: "newPassword", state: "new" },
            {
              label: "Retype password",
              key: "retypePassword",
              state: "retype",
            },
          ].map((field) => (
            <div key={field.key} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={
                    showPassword[field.state as keyof typeof showPassword]
                      ? "text"
                      : "password"
                  }
                  name={field.key}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full pl-10 text-black pr-10 p-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-blue-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    toggleVisibility(
                      field.state as "current" | "new" | "retype",
                    )
                  }
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword[field.state as keyof typeof showPassword] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
          <button className="px-6 hover:cursor-pointer py-2 border border-red-400 text-red-400 rounded hover:bg-red-50 font-medium">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
