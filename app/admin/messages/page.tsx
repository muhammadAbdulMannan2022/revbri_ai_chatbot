"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Mail,
  PencilLine,
  Plus,
  Trash2,
  Bell,
  Loader2,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import {
  PushNotificationModal,
  EmailPreparationModal,
} from "@/lib/NotificationModals";
import {
  useGetAdminNotificationsToUsersQuery,
  useGetEmailsQuery,
  useCreateEmailMutation,
  useCreateNotificationMutation,
  useUpdateEmailMutation,
  useDeleteEmailMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from "@/lib/authApi";
import toast from "react-hot-toast";

interface Email {
  id: number;
  user: number;
  set_date: string;
  set_time: string;
  select_audience: string;
  is_repeated: boolean;
  describe_email: string;
  is_active: boolean;
  created_at: string;
}

interface Notification {
  id: number;
  user: number;
  title: string;
  notification_banner: string;
  select_audience: string;
  description: string;
  is_read: boolean;
  is_deleted: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string) => {
  if (!timeString) return "—";
  try {
    // timeString may be "HH:MM:SS" or an ISO string
    const parts = timeString.includes("T")
      ? new Date(timeString).toTimeString().split(" ")[0].slice(0, 5)
      : timeString.slice(0, 5);
    const [h, m] = parts.split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
  } catch {
    return timeString;
  }
};

const audienceBadge = (audience: string | string[] | unknown) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    free:     { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", label: "Free" },
    premium:  { bg: "bg-[#fdf4ff]", text: "text-[#9333ea]", label: "Premium" },
    business: { bg: "bg-[#eff6ff]", text: "text-[#2563eb]", label: "Business" },
    tiered:   { bg: "bg-[#fff7ed]", text: "text-[#ea580c]", label: "Tiered" },
    active:   { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", label: "Active" },
    inactive: { bg: "bg-[#f9fafb]", text: "text-[#6b7280]", label: "Inactive" },
  };
  // API may return a JSON array like ["free"] or a plain string "free"
  const raw = Array.isArray(audience) ? audience[0] : audience;
  const key = (typeof raw === "string" ? raw : String(raw ?? "")).toLowerCase();
  const style = map[key] ?? {
    bg: "bg-[#f8fafc]",
    text: "text-[#374151]",
    label: audience,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
};

// ─── Confirm Delete Modal ────────────────────────────────────────────────────
function ConfirmDeleteModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-[400px] rounded-[18px] bg-white shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Icon strip */}
        <div className="flex flex-col items-center gap-3 bg-[#fff8f8] px-8 pt-8 pb-6 border-b border-[#fde8e8]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fef2f2] shadow-sm">
            <AlertTriangle size={26} className="text-[#ef5b5e]" strokeWidth={2} />
          </div>
          <h3 className="text-[17px] font-extrabold text-[#151b26] text-center">
            {title}
          </h3>
          <p className="text-[13px] text-[#7b8794] text-center leading-relaxed">
            {description}
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3 px-8 py-5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#ef5b5e] text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(239,91,94,0.25)] transition hover:bg-[#e04548] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={14} strokeWidth={2.2} />
            )}
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex flex-1 h-[42px] items-center justify-center rounded-[9px] border border-[#e8ecf0] bg-white text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc] disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
      `}</style>
    </div>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-[#f1f5f9]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3.5 animate-pulse rounded-full bg-[#f1f5f9]" />
        </td>
      ))}
    </tr>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8fafc]">
            <Inbox size={22} className="text-[#cbd5e1]" strokeWidth={1.5} />
          </div>
          <p className="text-[13px] font-semibold text-[#94a3b8]">{label}</p>
        </div>
      </td>
    </tr>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#edf0f4] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#edf0f4] px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#fff1f1]">
          {icon}
        </div>
        <h2 className="flex-1 text-[15px] font-extrabold text-[#151b26]">
          {title}
        </h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-[#f8fafc] px-2.5 py-0.5 text-[11px] font-bold text-[#687283]">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushOpen, setPushOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // ── Confirm-delete state ──────────────────────────────────────────────────
  type PendingDelete =
    | { kind: "email"; id: number; label: string }
    | { kind: "notification"; id: number; label: string }
    | null;
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useGetAdminNotificationsToUsersQuery();

  const {
    data: emailsData,
    isLoading: isEmailsLoading,
    refetch: refetchEmails,
  } = useGetEmailsQuery();

  const [createEmail] = useCreateEmailMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [updateEmail] = useUpdateEmailMutation();
  const [deleteEmailMutation] = useDeleteEmailMutation();
  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  useEffect(() => {
    if (!isEmailsLoading && emailsData) {
      const raw = emailsData?.results ?? emailsData;
      setEmails(Array.isArray(raw) ? raw : []);
    }
  }, [emailsData, isEmailsLoading]);

  useEffect(() => {
    if (!isNotificationsLoading && notificationsData) {
      const raw = notificationsData?.results ?? notificationsData;
      setNotifications(Array.isArray(raw) ? raw : []);
    }
  }, [notificationsData, isNotificationsLoading]);

  const toggleEmailStatus = async (emailId: number) => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;
    try {
      await updateEmail({
        id: emailId,
        body: { is_active: !email.is_active },
      }).unwrap();
      refetchEmails?.();
    } catch (err) {
      toast.error("Failed to toggle email status");
    }
  };

  const deleteEmail = async (emailId: number) => {
    setIsDeleting(true);
    try {
      await deleteEmailMutation(emailId).unwrap();
      toast.success("Email deleted");
      refetchEmails?.();
    } catch {
      toast.error("Failed to delete email");
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    setIsDeleting(true);
    try {
      await deleteNotificationMutation(notificationId).unwrap();
      toast.success("Notification deleted");
      refetchNotifications?.();
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const handleEditEmail = (email: Email) => {
    setSelectedEmail(email);
    setEmailOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setPushOpen(true);
  };

  return (
    <>
      {/* ── Modals ── */}
      <PushNotificationModal
        open={pushOpen}
        initial={selectedNotification}
        onClose={() => {
          setPushOpen(false);
          setSelectedNotification(null);
        }}
        onSend={async (payload) => {
          try {
            if (selectedNotification) {
              await updateNotification({
                id: selectedNotification.id,
                body: payload,
              }).unwrap();
              toast.success("Notification updated");
              setSelectedNotification(null);
            } else {
              await createNotification(payload).unwrap();
              toast.success("Notification sent");
            }
            refetchNotifications?.();
            setPushOpen(false);
          } catch {
            toast.error("Failed to save notification");
          }
        }}
      />

      <EmailPreparationModal
        open={emailOpen}
        initial={selectedEmail}
        onClose={() => {
          setEmailOpen(false);
          setSelectedEmail(null);
        }}
        onConfirm={async (payload) => {
          try {
            if (selectedEmail) {
              await updateEmail({ id: selectedEmail.id, body: payload }).unwrap();
              toast.success("Email updated");
              setSelectedEmail(null);
            } else {
              await createEmail(payload).unwrap();
              toast.success("Email scheduled");
            }
            refetchEmails?.();
            setEmailOpen(false);
          } catch {
            toast.error("Failed to save email");
          }
        }}
        onSaveDraft={async (payload) => {
          try {
            if (selectedEmail) {
              await updateEmail({
                id: selectedEmail.id,
                body: { ...payload, is_active: false },
              }).unwrap();
              toast.success("Draft updated");
              setSelectedEmail(null);
            } else {
              await createEmail({ ...payload, is_active: false }).unwrap();
              toast.success("Saved as draft");
            }
            refetchEmails?.();
            setEmailOpen(false);
          } catch {
            toast.error("Failed to save draft");
          }
        }}
      />

      {/* ── Confirm Delete Modal ── */}
      <ConfirmDeleteModal
        open={pendingDelete !== null}
        loading={isDeleting}
        title={
          pendingDelete?.kind === "email"
            ? "Delete Email Campaign?"
            : "Delete Notification?"
        }
        description={
          pendingDelete?.kind === "email"
            ? `This will permanently delete the email campaign for "${pendingDelete?.label}" audience. This action cannot be undone.`
            : `This will permanently delete the push notification "${pendingDelete?.label}". This action cannot be undone.`
        }
        onConfirm={() => {
          if (!pendingDelete) return;
          if (pendingDelete.kind === "email") deleteEmail(pendingDelete.id);
          else deleteNotification(pendingDelete.id);
        }}
        onCancel={() => setPendingDelete(null)}
      />

      {/* ── Header ── */}
      <section className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-[clamp(22px,1.55vw,28px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
            Messages &amp; Notifications
          </h1>
          <p className="mt-1 text-[13px] text-[#7b8794]">
            Manage your emails and push notifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-create-email"
            onClick={() => {
              setSelectedEmail(null);
              setEmailOpen(true);
            }}
            className="flex h-[42px] items-center gap-2 rounded-[8px] border border-[#e8ecf0] bg-white px-5 text-[12px] font-extrabold text-[#374151] shadow-sm transition hover:bg-[#f8fafc]"
          >
            <Mail size={14} className="text-[#ef5b5e]" strokeWidth={2.2} />
            Create Email
          </button>
          <button
            type="button"
            id="btn-create-push"
            onClick={() => {
              setSelectedNotification(null);
              setPushOpen(true);
            }}
            className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#ef5b5e] px-5 text-[12px] font-extrabold text-white shadow-[0_4px_12px_rgba(239,91,94,0.25)] transition hover:bg-[#e65255]"
          >
            <Plus size={14} strokeWidth={2.3} />
            Push Notification
          </button>
        </div>
      </section>

      {/* ── Emails Table ── */}
      <div className="mt-8">
        <SectionCard
          icon={<Mail size={16} className="text-[#ef5b5e]" strokeWidth={2} />}
          title="Email Campaigns"
          count={isEmailsLoading ? undefined : emails.length}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#94a3b8]">
                  <th className="px-6 py-3.5 font-bold">Audience</th>
                  <th className="px-6 py-3.5 font-bold">Date</th>
                  <th className="px-6 py-3.5 font-bold">Time</th>
                  <th className="px-6 py-3.5 font-bold">Repeat</th>
                  <th className="px-6 py-3.5 font-bold text-center">Status</th>
                  <th className="px-6 py-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isEmailsLoading ? (
                  <>
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                  </>
                ) : emails.length === 0 ? (
                  <EmptyState label="No emails found" />
                ) : (
                  emails.map((email) => (
                    <tr
                      key={email.id}
                      className="border-b border-[#f1f5f9] text-[12px] text-[#1e293b] last:border-b-0 transition hover:bg-[#fafbfc]"
                    >
                      {/* Audience */}
                      <td className="px-6 py-4">
                        {audienceBadge(email.select_audience)}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[#374151]">
                          <CalendarDays
                            size={12}
                            className="shrink-0 text-[#94a3b8]"
                            strokeWidth={1.8}
                          />
                          <span className="font-medium">
                            {email.set_date ? formatDate(email.set_date) : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[#374151]">
                          <Clock
                            size={12}
                            className="shrink-0 text-[#94a3b8]"
                            strokeWidth={1.8}
                          />
                          <span className="font-medium">
                            {email.set_time ? formatTime(email.set_time) : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Repeat */}
                      <td className="px-6 py-4 font-medium text-[#7b8794]">
                        {email.is_repeated ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-bold text-[#2563eb]">
                            🔄 Repeating
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#cbd5e1]">
                            One-time
                          </span>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`text-[11px] font-semibold ${
                              email.is_active
                                ? "text-[#16a34a]"
                                : "text-[#94a3b8]"
                            }`}
                          >
                            {email.is_active ? "Active" : "Draft"}
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={email.is_active}
                            aria-label={`Toggle ${email.select_audience} email`}
                            onClick={() => toggleEmailStatus(email.id)}
                            className={`relative h-[18px] w-[32px] rounded-full transition ${
                              email.is_active ? "bg-[#ef5b5e]" : "bg-[#e2e8f0]"
                            }`}
                          >
                            <span
                              className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
                                email.is_active ? "right-[3px]" : "left-[3px]"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            id={`email-edit-${email.id}`}
                            onClick={() => handleEditEmail(email)}
                            className="flex items-center gap-1.5 rounded-[6px] bg-[#faf5ff] px-2.5 py-1.5 text-[10px] font-bold text-[#7c3aed] transition hover:bg-[#f3e8ff]"
                          >
                            <PencilLine size={11} strokeWidth={2} />
                            Edit
                          </button>
                          <button
                            type="button"
                            id={`email-delete-${email.id}`}
                            onClick={() =>
                              setPendingDelete({
                                kind: "email",
                                id: email.id,
                                label: String(Array.isArray(email.select_audience) ? email.select_audience[0] : email.select_audience),
                              })
                            }
                            className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[10px] font-bold text-[#ef4444] transition hover:bg-[#fff1f1]"
                          >
                            <Trash2 size={11} strokeWidth={2} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ── Notifications Table ── */}
      <div className="mt-6">
        <SectionCard
          icon={<Bell size={16} className="text-[#ef5b5e]" strokeWidth={2} />}
          title="Push Notifications"
          count={isNotificationsLoading ? undefined : notifications.length}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#94a3b8]">
                  <th className="px-6 py-3.5 font-bold">Audience</th>
                  <th className="px-6 py-3.5 font-bold">Title</th>
                  <th className="px-6 py-3.5 font-bold">Description</th>
                  <th className="px-6 py-3.5 font-bold">Sent At</th>
                  <th className="px-6 py-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isNotificationsLoading ? (
                  <>
                    <SkeletonRow cols={5} />
                    <SkeletonRow cols={5} />
                    <SkeletonRow cols={5} />
                  </>
                ) : notifications.length === 0 ? (
                  <EmptyState label="No notifications found" />
                ) : (
                  notifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className="border-b border-[#f1f5f9] text-[12px] text-[#1e293b] last:border-b-0 transition hover:bg-[#fafbfc]"
                    >
                      {/* Audience */}
                      <td className="px-6 py-4">
                        {audienceBadge(notification.select_audience)}
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 font-semibold">
                        {notification.title}
                      </td>

                      {/* Description */}
                      <td className="max-w-[260px] truncate px-6 py-4 text-[#7b8794]">
                        {notification.description}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[#374151]">
                          <CalendarDays
                            size={12}
                            className="shrink-0 text-[#94a3b8]"
                            strokeWidth={1.8}
                          />
                          <span className="font-medium">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            id={`notif-edit-${notification.id}`}
                            onClick={() => handleEditNotification(notification)}
                            className="flex items-center gap-1.5 rounded-[6px] bg-[#faf5ff] px-2.5 py-1.5 text-[10px] font-bold text-[#7c3aed] transition hover:bg-[#f3e8ff]"
                          >
                            <PencilLine size={11} strokeWidth={2} />
                            Edit
                          </button>
                          <button
                            type="button"
                            id={`notif-delete-${notification.id}`}
                            onClick={() =>
                              setPendingDelete({
                                kind: "notification",
                                id: notification.id,
                                label: notification.title,
                              })
                            }
                            className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[10px] font-bold text-[#ef4444] transition hover:bg-[#fff1f1]"
                          >
                            <Trash2 size={11} strokeWidth={2} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* bottom padding */}
          <div className="h-8" />
        </SectionCard>
      </div>
    </>
  );
}
