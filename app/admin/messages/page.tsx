"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Mail,
  PencilLine,
  Plus,
  Trash2,
  Bell,
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
  is_read: boolean; // no need to show this in the table
  is_deleted: boolean; // no need to show this in the table
  created_at: string;
}

export default function MessagesPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushOpen, setPushOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

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

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!isEmailsLoading && emailsData) {
      setEmails(emailsData.results || []);
    }
    if (!isNotificationsLoading && notificationsData) {
      setNotifications(notificationsData.results || []);
    }
  }, [emailsData, isEmailsLoading, notificationsData, isNotificationsLoading]);

  const toggleEmailStatus = async (emailId: number) => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;
    try {
      await updateEmail({ id: emailId, body: { is_active: !email.is_active } }).unwrap();
      refetchEmails?.();
    } catch (err) {
      console.error("Failed to toggle email status", err);
    }
  };

  const deleteEmail = async (emailId: number) => {
    try {
      await deleteEmailMutation(emailId).unwrap();
      refetchEmails?.();
    } catch (err) {
      console.error("Failed to delete email", err);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await deleteNotificationMutation(notificationId).unwrap();
      refetchNotifications?.();
    } catch (err) {
      console.error("Failed to delete notification", err);
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

  // Helper function to format dates nicely if needed, or fallback to raw string
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* HEADER SECTION */}
      <section className="flex items-center justify-between gap-6">
        <h1 className="text-[clamp(24px,1.55vw,28px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
          Messages & Notifications
        </h1>

        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className="flex h-[42px] items-center justify-center gap-[10px] rounded-[7px] bg-[#ef5b5e] px-[24px] text-[12px] font-extrabold text-white shadow-[0_7px_16px_rgba(239,91,94,0.16)] transition hover:bg-[#e65255]"
          >
            <Plus size={14} strokeWidth={2.3} />
            Create Email
          </button>
          <button
            type="button"
            onClick={() => setPushOpen(true)}
            className="flex h-[42px] items-center justify-center gap-[10px] rounded-[7px] bg-[#ef5b5e] px-[24px] text-[12px] font-extrabold text-white shadow-[0_7px_16px_rgba(239,91,94,0.16)] transition hover:bg-[#e65255]"
          >
            <Plus size={14} strokeWidth={2.3} />
            Push Notification
          </button>
        </div>
      </section>
      {/* Modals mounted here so they can be opened from the page */}
      <PushNotificationModal
        open={pushOpen}
        initial={selectedNotification}
        onClose={() => { setPushOpen(false); setSelectedNotification(null); }}
        onSend={async (formOrPayload) => {
          try {
            if (selectedNotification) {
              // editing existing notification
              await updateNotification({ id: selectedNotification.id, body: formOrPayload }).unwrap();
              setSelectedNotification(null);
            } else {
              await createNotification(formOrPayload).unwrap();
            }
            // refresh notification list
            refetchNotifications?.();
            setPushOpen(false);
          } catch (err) {
            console.error("Failed to create/update notification", err);
          }
        }}
      />

      <EmailPreparationModal
        open={emailOpen}
        initial={selectedEmail}
        onClose={() => { setEmailOpen(false); setSelectedEmail(null); }}
        onConfirm={async (payload) => {
          try {
            if (selectedEmail) {
              await updateEmail({ id: selectedEmail.id, body: payload }).unwrap();
              setSelectedEmail(null);
            } else {
              await createEmail(payload).unwrap();
            }
            refetchEmails?.();
            setEmailOpen(false);
          } catch (err) {
            console.error("Failed to create/update email", err);
          }
        }}
        onSaveDraft={async (payload) => {
          try {
            if (selectedEmail) {
              await updateEmail({ id: selectedEmail.id, body: { ...payload, is_active: false } }).unwrap();
              setSelectedEmail(null);
            } else {
              await createEmail({ ...payload, is_active: false }).unwrap();
            }
            refetchEmails?.();
            setEmailOpen(false);
          } catch (err) {
            console.error("Failed to save draft", err);
          }
        }}
      />

      {/* 1. EMAILS TABLE SECTION */}
      <section className="mt-[32px] bg-white">
        <div className="px-[40px] py-[20px] border-b border-[#edf0f4]">
          <h2 className="text-[16px] font-bold text-[#151b26]">
            List of Emails
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead>
              <tr className="bg-[#ededed] text-[10px] uppercase tracking-normal text-[#687283]">
                <th className="w-[29%] px-[40px] py-[18px] text-center font-bold">
                  Audience
                </th>
                <th className="w-[24%] px-[24px] py-[18px] text-center font-bold">
                  Date
                </th>
                <th className="w-[20%] px-[24px] py-[18px] text-center font-bold">
                  Time
                </th>
                <th className="w-[13%] px-[24px] py-[18px] text-center font-bold">
                  Status
                </th>
                <th className="w-[14%] px-[30px] py-[18px] text-center font-bold">
                  Offer Package
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr
                  key={email.id}
                  className="border-b border-[#edf0f4] text-[11px] text-[#172033] last:border-b-0"
                >
                  <td className="px-[40px] py-[31px]">
                    <div className="flex items-center gap-[7px]">
                      <Mail
                        size={13}
                        className="text-[#7b8794]"
                        strokeWidth={1.8}
                      />
                      <span className="font-extrabold">
                        {email.select_audience}
                      </span>
                    </div>
                  </td>
                  <td className="px-[24px] py-[31px] text-center font-medium">
                    September 24, 2017
                  </td>
                  <td className="px-[24px] py-[31px]">
                    <div className="flex items-center justify-center gap-[7px]">
                      <CalendarDays
                        size={12}
                        className="text-[#7b8794]"
                        strokeWidth={1.9}
                      />
                      <span className="font-medium">01:34 pm</span>
                    </div>
                  </td>
                  <td className="px-[24px] py-[31px]">
                    <div className="flex items-center justify-center gap-[12px]">
                      <span className="font-semibold">
                        {email.is_active ? "Active" : "Inactive"}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={email.is_active}
                        aria-label={`Toggle ${email.select_audience} email status`}
                        onClick={() => toggleEmailStatus(email.id)}
                        className={`relative h-[17px] w-[31px] rounded-full transition ${
                          email.is_active ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                        }`}
                      >
                        <span
                          className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                            email.is_active ? "right-[3px]" : "left-[3px]"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-[30px] py-[31px]">
                    <div className="flex items-center justify-center gap-[14px]">
                      <button
                        type="button"
                        onClick={() => handleEditEmail(email)}
                        className="flex items-center gap-[6px] rounded-[5px] bg-[#faf7ff] px-[8px] py-[5px] text-[10px] font-extrabold text-[#111827] transition hover:bg-[#f3e8ff]"
                      >
                        <PencilLine
                          size={12}
                          className="text-[#8b5cf6]"
                          strokeWidth={2}
                        />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEmail(email.id)}
                        className="flex items-center gap-[6px] rounded-[5px] px-[8px] py-[5px] text-[10px] font-extrabold text-[#111827] transition hover:bg-[#fff1f1]"
                      >
                        <Trash2
                          size={12}
                          className="text-[#ef4444]"
                          strokeWidth={2}
                        />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {emails.length === 0 && (
            <div className="py-10 text-center text-[12px] text-gray-400">
              No emails found.
            </div>
          )}
        </div>
      </section>

      {/* 2. NOTIFICATIONS TABLE SECTION */}
      <section className="mt-[48px] bg-white">
        <div className="px-[40px] py-[20px] border-b border-[#edf0f4]">
          <h2 className="text-[16px] font-bold text-[#151b26]">
            List of Notifications
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead>
              <tr className="bg-[#ededed] text-[10px] uppercase tracking-normal text-[#687283]">
                <th className="w-[20%] px-[40px] py-[18px] text-center font-bold">
                  Audience
                </th>
                <th className="w-[25%] px-[24px] py-[18px] text-center font-bold">
                  Title
                </th>
                <th className="w-[30%] px-[24px] py-[18px] text-center font-bold">
                  Description
                </th>
                <th className="w-[11%] px-[24px] py-[18px] text-center font-bold">
                  Created At
                </th>
                <th className="w-[14%] px-[30px] py-[18px] text-center font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className="border-b border-[#edf0f4] text-[11px] text-[#172033] last:border-b-0"
                >
                  {/* Audience */}
                  <td className="px-[40px] py-[24px]">
                    <div className="flex items-center gap-[7px]">
                      <Bell
                        size={13}
                        className="text-[#7b8794]"
                        strokeWidth={1.8}
                      />
                      <span className="font-extrabold">
                        {notification.select_audience}
                      </span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-[24px] py-[24px] font-semibold text-center">
                    {notification.title}
                  </td>

                  {/* Description */}
                  <td className="px-[24px] py-[24px] text-gray-500 max-w-[300px] truncate text-center">
                    {notification.description}
                  </td>

                  {/* Created At */}
                  <td className="px-[24px] py-[24px] text-center font-medium text-gray-600">
                    {formatDate(notification.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-[30px] py-[24px]">
                    <div className="flex items-center justify-center gap-[14px]">
                      <button
                        type="button"
                        onClick={() => handleEditNotification(notification)}
                        className="flex items-center gap-[6px] rounded-[5px] bg-[#faf7ff] px-[8px] py-[5px] text-[10px] font-extrabold text-[#111827] transition hover:bg-[#f3e8ff]"
                      >
                        <PencilLine
                          size={12}
                          className="text-[#8b5cf6]"
                          strokeWidth={2}
                        />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-[6px] rounded-[5px] px-[8px] py-[5px] text-[10px] font-extrabold text-[#111827] transition hover:bg-[#fff1f1]"
                      >
                        <Trash2
                          size={12}
                          className="text-[#ef4444]"
                          strokeWidth={2}
                        />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {notifications.length === 0 && (
            <div className="py-10 text-center text-[12px] text-gray-400">
              No notifications found.
            </div>
          )}
          <div className="h-[143px] border-t border-[#edf0f4] bg-white" />
        </div>
      </section>
    </>
  );
}
