"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Zap } from "lucide-react";

// ─── Dynamic variable suggestions ────────────────────────────────────────────
// Derived from ProfileData (excluding profile_image) and nested PricingPlan
const DYNAMIC_VARS = [
  // ── User fields ──────────────────────────────────────────────────────────
  { key: "full_name",        label: "Full Name",       desc: "User's full name (e.g. John Doe)" },
  { key: "email",            label: "Email",           desc: "User's email address" },
  { key: "role",             label: "Role",            desc: "Account role (e.g. normal, admin)" },
  // ── Pricing plan fields ──────────────────────────────────────────────────
  { key: "plan_name",        label: "Plan Name",       desc: "Subscription plan name" },
  { key: "plan_type",        label: "Plan Type",       desc: "Type of plan (e.g. monthly, yearly)" },
  { key: "price_per_member", label: "Price/Member",    desc: "Price charged per team member" },
  { key: "billing_cycle",    label: "Billing Cycle",   desc: "Billing frequency (e.g. Monthly)" },
  { key: "ai_query_limit",   label: "AI Query Limit",  desc: "Monthly AI query allowance" },
  { key: "badge_label",      label: "Badge Label",     desc: "Plan badge label (e.g. Pro, Free)" },
];

// ─── Measure caret pixel position inside a textarea ─────────────────────────
function getCaretPixelPos(ta: HTMLTextAreaElement, caretIndex: number) {
  const computed = window.getComputedStyle(ta);

  const mirror = document.createElement("div");
  mirror.style.cssText = [
    `position:fixed`,
    `visibility:hidden`,
    `pointer-events:none`,
    `white-space:pre-wrap`,
    `word-wrap:break-word`,
    `overflow-wrap:break-word`,
    `overflow:hidden`,
    `box-sizing:${computed.boxSizing}`,
    `width:${computed.width}`,
    `padding:${computed.padding}`,
    `border:${computed.border}`,
    `font-family:${computed.fontFamily}`,
    `font-size:${computed.fontSize}`,
    `font-weight:${computed.fontWeight}`,
    `font-style:${computed.fontStyle}`,
    `line-height:${computed.lineHeight}`,
    `letter-spacing:${computed.letterSpacing}`,
    `tab-size:${computed.tabSize}`,
    `left:${ta.getBoundingClientRect().left}px`,
    `top:${ta.getBoundingClientRect().top}px`,
  ].join(";");

  // Text before caret
  const textNode = document.createTextNode(ta.value.slice(0, caretIndex));
  mirror.appendChild(textNode);

  // Marker span at caret
  const marker = document.createElement("span");
  marker.textContent = "\u200b"; // zero-width space
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const taRect = ta.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();

  // Offset relative to the textarea element, accounting for scroll
  const top = markerRect.top - taRect.top + ta.scrollTop;
  const left = markerRect.left - taRect.left;

  document.body.removeChild(mirror);
  return { top, left };
}

// ─── Smart textarea with {{ }} autocomplete ───────────────────────────────────
function SmartTextarea({
  value,
  onChange,
  rows = 6,
  placeholder,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}) {
  const [suggestions, setSuggestions] = useState<typeof DYNAMIC_VARS>([]);
  const [triggerPos, setTriggerPos] = useState<number | null>(null);
  const [dropdownIdx, setDropdownIdx] = useState(0);
  // Pixel offset of caret inside the textarea
  const [caretPos, setCaretPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const detectTrigger = (text: string, cursor: number) => {
    const before = text.slice(0, cursor);
    const lastOpen = before.lastIndexOf("{{");
    if (lastOpen === -1) return null;
    const afterOpen = before.slice(lastOpen + 2);
    if (afterOpen.includes("}}")) return null;
    return { start: lastOpen, typed: afterOpen };
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    const cursor = e.target.selectionStart ?? val.length;
    const trigger = detectTrigger(val, cursor);
    if (trigger) {
      // Measure where the caret is RIGHT NOW
      const pos = getCaretPixelPos(e.target, cursor);
      setCaretPos(pos);
      setTriggerPos(trigger.start);
      const q = trigger.typed.toLowerCase();
      const filtered = DYNAMIC_VARS.filter(
        (v) => v.key.includes(q) || v.label.toLowerCase().includes(q)
      );
      setSuggestions(filtered);
      setDropdownIdx(0);
    } else {
      setSuggestions([]);
      setTriggerPos(null);
    }
  };

  const insertVar = (varKey: string) => {
    if (triggerPos === null || !textareaRef.current) return;
    const ta = textareaRef.current;
    const cursor = ta.selectionStart ?? value.length;
    const before = value.slice(0, triggerPos);
    const after = value.slice(cursor);
    const inserted = `{{${varKey}}}`;
    const newVal = before + inserted + after;
    onChange(newVal);
    setSuggestions([]);
    setTriggerPos(null);
    setTimeout(() => {
      const pos = before.length + inserted.length;
      ta.setSelectionRange(pos, pos);
      ta.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDropdownIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setDropdownIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (suggestions[dropdownIdx]) insertVar(suggestions[dropdownIdx].key);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setTriggerPos(null);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOut = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
        setTriggerPos(null);
      }
    };
    document.addEventListener("mousedown", handleClickOut);
    return () => document.removeEventListener("mousedown", handleClickOut);
  }, []);

  // Compute line-height in px so we can push the dropdown below the current line
  const lineHeightPx = textareaRef.current
    ? parseFloat(window.getComputedStyle(textareaRef.current).lineHeight) || 20
    : 20;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="block w-full rounded-[8px] border border-[#e8ecf0] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#1e293b] font-mono placeholder:text-[#94a3b8] placeholder:font-sans focus:border-[#ef5b5e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5b5e]/10 transition resize-y min-h-[120px]"
      />
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-[280px] rounded-[10px] border border-[#e8ecf0] bg-white shadow-xl overflow-hidden"
          style={{
            // Place the dropdown right below the caret line
            top: caretPos.top + lineHeightPx + 4,
            left: Math.min(
              caretPos.left,
              (textareaRef.current?.offsetWidth ?? 300) - 288
            ),
          }}
        >
          <div className="flex items-center gap-2 border-b border-[#f1f5f9] px-3 py-2">
            <Zap size={12} className="text-[#ef5b5e]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              Dynamic Variables
            </span>
          </div>
          {suggestions.map((v, i) => (
            <button
              key={v.key}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertVar(v.key);
              }}
              className={`flex w-full items-start gap-3 px-3 py-2 text-left transition ${
                i === dropdownIdx
                  ? "bg-[#fff1f1]"
                  : "hover:bg-[#f8fafc]"
              }`}
            >
              <code className="mt-0.5 rounded bg-[#fef2f2] px-1.5 py-0.5 text-[10px] font-bold text-[#ef5b5e] font-mono shrink-0">
                {`{{${v.key}}}`}
              </code>
              <span className="flex flex-col">
                <span className="text-[12px] font-semibold text-[#1e293b]">
                  {v.label}
                </span>
                <span className="text-[10px] text-[#94a3b8]">{v.desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="mt-1.5 text-[10px] text-[#94a3b8]">
        Type{" "}
        <code className="rounded bg-[#f1f5f9] px-1 py-0.5 text-[10px] font-mono text-[#ef5b5e]">
          {"{{"}
        </code>{" "}
        to insert a dynamic variable
      </p>
    </div>
  );
}

// ─── Shared modal shell ───────────────────────────────────────────────────────
function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[16px] bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#f1f5f9] bg-white px-8 py-6">
          <div>
            <h3 className="text-[18px] font-extrabold text-[#151b26]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-[#7b8794]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8fafc] text-[#7b8794] transition hover:bg-[#f1f5f9] hover:text-[#151b26]"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>
        {/* Body */}
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[12px] font-bold text-[#374151] uppercase tracking-wide"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "block w-full rounded-[8px] border border-[#e8ecf0] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#ef5b5e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5b5e]/10 transition";

const selectCls =
  "block w-full rounded-[8px] border border-[#e8ecf0] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#1e293b] focus:border-[#ef5b5e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5b5e]/10 transition appearance-none cursor-pointer";

// ─── Push Notification Modal ──────────────────────────────────────────────────
type PushProps = {
  open: boolean;
  onClose: () => void;
  onSend?: (payload: any) => void;
  initial?: any;
};

export function PushNotificationModal({
  open,
  onClose,
  onSend,
  initial,
}: PushProps) {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title ?? "");
      setAudience(initial.select_audience ?? "");
      setDescription(initial.description ?? "");
    }
    if (!open) {
      // Reset when closed
      setTitle("");
      setAudience("");
      setDescription("");
      setBannerFile(null);
      setBannerPreview(null);
    }
  }, [open, initial]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBannerFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    } else {
      setBannerPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerFile) {
      const body = new FormData();
      body.append("title", title);
      body.append("select_audience", JSON.stringify([audience]));
      body.append("description", description);
      body.append("notification_banner", bannerFile);
      onSend?.(body);
    } else {
      onSend?.({ title, select_audience: [audience], description });
    }
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={initial ? "Edit Push Notification" : "Push Notification"}
      subtitle="Send a push notification to your users"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Notification Title" htmlFor="push-title">
          <input
            id="push-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Feature Released 🚀"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Select Audience" htmlFor="push-audience">
          <div className="relative">
            <select
              id="push-audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={selectCls}
              required
            >
              <option value="">Choose audience…</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
              <option value="business">Business Users</option>
              <option value="tiered">Tiered Pack Users</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
          </div>
        </Field>

        <Field label="Notification Banner (Optional)" htmlFor="push-banner">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="push-banner"
              className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-dashed border-[#e8ecf0] bg-[#f8fafc] px-4 py-3 transition hover:border-[#ef5b5e] hover:bg-[#fff8f8]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fef2f2]">
                <span className="text-[16px]">🖼</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#374151]">
                  {bannerFile ? bannerFile.name : "Upload banner image"}
                </p>
                <p className="text-[10px] text-[#94a3b8]">PNG, JPG up to 10MB</p>
              </div>
              <input
                id="push-banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="sr-only"
              />
            </label>
            {bannerPreview && (
              <div className="relative overflow-hidden rounded-[8px] border border-[#e8ecf0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="h-[120px] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setBannerFile(null);
                    setBannerPreview(null);
                  }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </Field>

        <Field label="Description" htmlFor="push-description">
          <SmartTextarea
            id="push-description"
            value={description}
            onChange={setDescription}
            rows={5}
            placeholder={"Hi {{full_name}}, we have an exciting update for you!"}
          />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#ef5b5e] px-6 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(239,91,94,0.25)] transition hover:bg-[#e65255] hover:shadow-[0_6px_16px_rgba(239,91,94,0.35)]"
          >
            <span>🔔</span>
            {initial ? "Update Notification" : "Send Notification"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] items-center rounded-[8px] border border-[#e8ecf0] bg-white px-5 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Email Preparation Modal ──────────────────────────────────────────────────
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
    "Dear {{full_name}},\n\nI hope you are doing well.\n\nYour current plan: {{plan_name}} ({{badge_label}}).\n"
  );

  useEffect(() => {
    if (open && initial) {
      if (initial.set_date) {
        const d = new Date(initial.set_date);
        if (!isNaN(d.getTime())) setDate(d.toISOString().split("T")[0]);
      }
      if (initial.set_time) setTime(initial.set_time.slice(0, 5));
      if (initial.select_audience) {
        const aud = Array.isArray(initial.select_audience)
          ? initial.select_audience[0]
          : initial.select_audience;
        setAudience(aud || "");
      }
      if (initial.is_repeated) setRepeatContinuously(Boolean(initial.is_repeated));
      if (initial.repeated_type) {
        if (initial.repeated_type === "daily") setRepeating("every_3_days");
        else if (initial.repeated_type === "monthly") setRepeating("every_month");
        else setRepeating("custom");
      }
      if (initial.describe_email) setDescription(initial.describe_email);
    }
    if (!open) {
      setDate("");
      setTime("");
      setAudience("");
      setRepeating("");
      setRepeatContinuously(false);
      setCustomRepeating("");
      setDescription("Dear {{full_name}},\n\nI hope you are doing well.\n");
    }
  }, [open, initial]);

  const buildEmailPayload = (isActive = true) => {
    const localDateStr = date || new Date().toISOString().split("T")[0];
    const localTimeStr = time
      ? `${time}:00`
      : new Date().toTimeString().split(" ")[0].slice(0, 8);

    const [year, month, day] = localDateStr.split("-").map(Number);
    const [hours, minutes, seconds] = localTimeStr.split(":").map(Number);

    const localDateObj = new Date(year, month - 1, day, hours, minutes, seconds || 0);

    const utcYear = localDateObj.getUTCFullYear();
    const utcMonth = String(localDateObj.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(localDateObj.getUTCDate()).padStart(2, "0");

    const utcHours = String(localDateObj.getUTCHours()).padStart(2, "0");
    const utcMinutes = String(localDateObj.getUTCMinutes()).padStart(2, "0");
    const utcSeconds = String(localDateObj.getUTCSeconds()).padStart(2, "0");

    const set_date = `${utcYear}-${utcMonth}-${utcDay}`;
    const set_time = `${utcHours}:${utcMinutes}:${utcSeconds}`;

    let repeated_type = "";
    if (repeatContinuously) {
      if (repeating === "every_3_days") repeated_type = "daily";
      else if (repeating === "every_month") repeated_type = "monthly";
      else if (repeating === "custom") repeated_type = customRepeating || "custom";
    }

    const user_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka";

    return {
      set_date,
      set_time,
      user_time_zone,
      select_audience: audience ? [audience] : [],
      is_repeated: !!repeatContinuously,
      repeated_type,
      describe_email: description,
      is_active: isActive,
    };
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={initial ? "Edit Email" : "Email Preparation"}
      subtitle="Compose and schedule an email campaign"
    >
      <form className="flex flex-col gap-5">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Send Date" htmlFor="email-date">
            <input
              id="email-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className={inputCls}
            />
          </Field>
          <Field label="Send Time" htmlFor="email-time">
            <input
              id="email-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Audience */}
        <Field label="Select Audience" htmlFor="email-audience">
          <div className="relative">
            <select
              id="email-audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={selectCls}
            >
              <option value="">Choose audience…</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
              <option value="business">Business Users</option>
              <option value="tiered">Tiered Pack Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
          </div>
        </Field>

        {/* Repeat */}
        <Field label="Scheduling">
          <div className="flex flex-col gap-3 rounded-[8px] border border-[#e8ecf0] bg-[#f8fafc] px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3 select-none">
              <div
                onClick={() => setRepeatContinuously((v) => !v)}
                className={`relative h-[20px] w-[36px] cursor-pointer rounded-full transition ${
                  repeatContinuously ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
                    repeatContinuously ? "right-[3px]" : "left-[3px]"
                  }`}
                />
              </div>
              <span className="text-[13px] font-semibold text-[#374151]">
                Repeat Email Continuously
              </span>
            </label>

            {repeatContinuously && (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <select
                    value={repeating}
                    onChange={(e) => setRepeating(e.target.value)}
                    className={selectCls}
                    aria-label="Repeating criteria"
                  >
                    <option value="">Select Repeating Criteria</option>
                    <option value="every_3_days">Every 3 days</option>
                    <option value="every_month">Every month</option>
                    <option value="custom">Custom…</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                  />
                </div>
                {repeating === "custom" && (
                  <input
                    value={customRepeating}
                    onChange={(e) => setCustomRepeating(e.target.value)}
                    placeholder="e.g., every 2 weeks"
                    className={inputCls}
                  />
                )}
              </div>
            )}
          </div>
        </Field>

        {/* Describe Email */}
        <Field label="Email Body" htmlFor="email-body">
          <SmartTextarea
            id="email-body"
            value={description}
            onChange={setDescription}
            rows={8}
            placeholder={"Dear {{full_name}},\n\nYour plan is {{plan_name}}."}
          />
        </Field>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.(buildEmailPayload(true));
              onClose();
            }}
            className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#ef5b5e] px-6 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(239,91,94,0.25)] transition hover:bg-[#e65255]"
          >
            <span>📧</span>
            {initial ? "Update Email" : "Confirm & Send"}
          </button>
          {!initial && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSaveDraft?.(buildEmailPayload(false));
                onClose();
              }}
              className="flex h-[42px] items-center rounded-[8px] border border-[#e8ecf0] bg-white px-5 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
            >
              Save as Draft
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] items-center rounded-[8px] px-4 text-[13px] font-semibold text-[#94a3b8] transition hover:text-[#374151]"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
