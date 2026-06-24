"use client";

import React, { useState, Fragment } from "react";
import { X } from "lucide-react";

type PushProps = {
  open: boolean;
  onClose: () => void;
  onSend?: (payload: any) => void;
  initial?: any;
};

export function PushNotificationModal({ open, onClose, onSend, initial }: PushProps) {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (initial) {
      if (initial.title) setTitle(initial.title);
      if (initial.select_audience) setAudience(initial.select_audience);
      if (initial.description) setDescription(initial.description);
    }
  }, [initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If a banner file is present we must send multipart/form-data
    if (bannerFile) {
      const body = new FormData();
      body.append("title", title);
      // store audience as JSON string so backend can parse it
      body.append("select_audience", JSON.stringify([audience]));
      body.append("description", description);
      body.append("notification_banner", bannerFile);
      onSend?.(body);
      onClose();
      return;
    }

    // Otherwise send JSON; ensure select_audience is valid JSON (array)
    const payload = {
      title,
      select_audience: [audience],
      description,
    };
    onSend?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[720px] max-w-full bg-white rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X />
        </button>
        <h3 className="text-lg font-semibold mb-4">
          Push Notification Preparation
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white p-3"
            >
              <option value="">Select audience</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
              <option value="business">Business Users</option>
              <option value="tiered">Tiered Pack Users</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Banner (Optional)
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 p-3"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-red-400 text-white px-4 py-2 rounded-md"
            >
              Send Push Notification
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type EmailProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (payload: any) => void;
  onSaveDraft?: (payload: any) => void;
  initial?: any;
};

export function EmailPreparationModal({
  open,
  onClose,
  onConfirm,
  onSaveDraft,
  initial,
}: EmailProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [audience, setAudience] = useState("");
  const [repeating, setRepeating] = useState("");
  const [repeatContinuously, setRepeatContinuously] = useState(false);
  const [customRepeating, setCustomRepeating] = useState("");
  const [description, setDescription] = useState(
    "Dear {FirstName}\n\nI hope you are doing well.\n",
  );

  // populate when editing
  React.useEffect(() => {
    if (initial) {
      if (initial.set_date) {
        const d = new Date(initial.set_date);
        if (!isNaN(d.getTime())) setDate(d.toISOString().split("T")[0]);
      }
      if (initial.set_time) {
        // assume set_time like HH:MM:SS or HH:MM
        setTime(initial.set_time.slice(0, 5));
      }
      if (initial.select_audience) setAudience(initial.select_audience);
      if (initial.is_repeated) setRepeatContinuously(Boolean(initial.is_repeated));
      if (initial.repeated_type) {
        if (initial.repeated_type === "daily") setRepeating("every_3_days");
        else if (initial.repeated_type === "monthly") setRepeating("every_month");
        else setRepeating("custom");
      }
      if (initial.describe_email) setDescription(initial.describe_email);
    }
  }, [initial]);

  const buildEmailPayload = () => {
    // set_date: ISO timestamp combining date+time if possible
    let set_date = new Date().toISOString();
    if (date) {
      const timePart = time || "00:00";
      const combined = `${date}T${timePart}`;
      const d = new Date(combined);
      if (!isNaN(d.getTime())) set_date = d.toISOString();
    }

    // set_time: use time input if provided, else derive from set_date
    const set_time = time
      ? `${time}:00`
      : new Date(set_date).toTimeString().split(" ")[0];

    // repeated_type mapping
    let repeated_type = "";
    if (repeatContinuously) {
      if (repeating === "every_3_days") repeated_type = "daily";
      else if (repeating === "every_month") repeated_type = "monthly";
      else if (repeating === "custom")
        repeated_type = customRepeating || "custom";
    }

    const payload = {
      set_date,
      set_time,
      select_audience: audience,
      is_repeated: !!repeatContinuously,
      repeated_type,
      describe_email: description,
      is_active: true,
    };
    return payload;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildEmailPayload();
    onConfirm?.(payload);
    onClose();
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildEmailPayload();
    onSaveDraft?.(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[760px] max-w-full bg-white rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X />
        </button>
        <h3 className="text-lg font-semibold mb-4">Email Preparation</h3>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Set Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Set Time
              </label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                type="time"
                className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 p-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white p-3"
            >
              <option value="">Select audience</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
              <option value="business">Business Users</option>
              <option value="tiered">Tiered Pack Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={repeatContinuously}
                onChange={(e) => setRepeatContinuously(e.target.checked)}
              />
              Repeat Email Continuously
            </label>

            {repeatContinuously && (
              <>
                <label className="sr-only">Repeating criteria</label>
                <select
                  value={repeating}
                  onChange={(e) => setRepeating(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-200 bg-gray-50 p-3"
                >
                  <option value="">Select Repeating Criteria</option>
                  <option value="every_3_days">Every 3 days</option>
                  <option value="every_month">Every month</option>
                  <option value="custom">Custom...</option>
                </select>
              </>
            )}

            {repeating === "custom" && (
              <input
                value={customRepeating}
                onChange={(e) => setCustomRepeating(e.target.value)}
                placeholder="e.g., every 2 weeks"
                className="mt-2 block w-full rounded-md border-gray-200 bg-white p-3"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Describe Email
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white p-3 font-sans"
            />
            <p className="text-xs text-gray-400 mt-1">
              You can use dynamic placeholders like {"{{FirstName}}"} inside the
              body.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirm}
              className="bg-red-400 text-white px-4 py-2 rounded-md"
            >
              Confirm Mail
            </button>
            <button
              onClick={handleSaveDraft}
              className="border px-4 py-2 rounded-md"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
