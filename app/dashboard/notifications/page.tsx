"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Bell, Trash2, Loader2, Inbox, Calendar, User } from "lucide-react";
import {
  useGetUserNotificationsQuery,
  useDeleteUserNotificationMutation,
  type UserNotification,
} from "@/lib/authApi";
import toast from "react-hot-toast";

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

function NotificationsContent() {
  const { data, isLoading, isError, refetch } = useGetUserNotificationsQuery();
  const [deleteNotification] = useDeleteUserNotificationMutation();

  const [liveNotifications, setLiveNotifications] = useState<
    UserNotification[]
  >([]);

  // Sync initial and updated query results into local state
  useEffect(() => {
    if (data?.results) {
      setLiveNotifications(data.results);
    }
  }, [data]);

  // WebSocket — best-effort live updates. Any failure is silently ignored;
  // the page always shows data from the REST API regardless.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let ws: WebSocket | null = null;
    try {
      const proto = window.location.protocol === "https:" ? "wss" : "ws";
      ws = new WebSocket(
        `${proto}://39c4-103-186-20-8.ngrok-free.app/ws/notifications/?token=${token}`,
      );

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const newNotif =
            payload.notification ||
            (payload.id && payload.title ? payload : null);
          if (newNotif) {
            setLiveNotifications((prev) =>
              prev.some((n) => n.id === newNotif.id)
                ? prev
                : [newNotif as UserNotification, ...prev],
            );
            toast.success(`New: ${newNotif.title || "Notification received"}`);
          }
          refetch();
        } catch {
          /* ignore malformed frames */
        }
      };

      ws.onerror = () => { /* silently ignore */ };
    } catch {
      /* WebSocket constructor failed — ignore, REST data still shows */
    }

    return () => {
      try { ws?.close(); } catch { /* ignore */ }
    };
  }, [refetch]);

  const handleDelete = async (id: number) => {
    try {
      // Optimistic delete
      setLiveNotifications((prev) => prev.filter((n) => n.id !== id));
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted successfully");
    } catch {
      toast.error("Failed to delete notification");
      refetch(); // Rollback / resync
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4 md:px-6 font-sans text-slate-800 flex flex-col gap-6 pb-20">
      {/* Header */}
      <section className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="text-[#ff5a5a] w-6 h-6 animate-swing" />
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with notifications and announcements tailored for you.
          </p>
        </div>
        {liveNotifications.length > 0 && (
          <span className="bg-[#ff5a5a] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
            {liveNotifications.length}{" "}
            {liveNotifications.length === 1 ? "Alert" : "Alerts"}
          </span>
        )}
      </section>

      {/* Main List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          // Skeleton Loader
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex gap-4 animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-100 rounded-sm w-1/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded-sm w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error State
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-red-500 shadow-xs flex flex-col items-center justify-center gap-3">
            <p className="font-semibold">
              Oops! Something went wrong loading notifications.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : liveNotifications.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 shadow-xs flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
              <Inbox size={32} />
            </div>
            <div>
              <p className="font-bold text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">
                You have no active notifications at the moment.
              </p>
            </div>
          </div>
        ) : (
          // Notifications list
          liveNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex gap-4 hover:shadow-md hover:translate-x-0.5 transition-all duration-200 relative group ${
                !notification.is_read ? "border-l-4 border-l-[#ff5a5a]" : ""
              }`}
            >
              {/* Notification Banner / Icon */}
              {notification.notification_banner ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100/50">
                  <img
                    src={notification.notification_banner}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ff5a5a] flex items-center justify-center shrink-0">
                  <Bell size={20} />
                </div>
              )}

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base tracking-tight leading-snug">
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <span className="inline-block w-2 h-2 bg-[#ff5a5a] rounded-full shrink-0 animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-line mb-3">
                  {notification.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDate(notification.created_at)}
                  </span>
                  {notification.select_audience &&
                    notification.select_audience.length > 0 && (
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-sm capitalize">
                        <User size={10} />
                        {notification.select_audience.join(", ")}
                      </span>
                    )}
                </div>
              </div>

              {/* Action - Delete Notification */}
              <div className="flex items-start shrink-0">
                <button
                  type="button"
                  onClick={() => handleDelete(notification.id)}
                  aria-label="Delete notification"
                  className="p-2 rounded-lg text-slate-400 hover:text-[#ff5a5a] hover:bg-red-50 transition cursor-pointer md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Page shell — wraps content in <Suspense> so the dashboard layout's
// useSearchParams() usage doesn't cause a prerender error at build time.
export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff5a5a] border-t-transparent" />
        </div>
      }
    >
      <NotificationsContent />
    </Suspense>
  );
}
