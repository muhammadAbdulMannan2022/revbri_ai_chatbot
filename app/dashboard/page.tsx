"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MessageBox from "@/components/dashboard/MessageInput";
import MessageDisplay from "@/components/dashboard/MessageDisplay";
import type { ChatMessage } from "@/lib/authApi";
import { useGetChatHistoryQuery, useSendMessageMutation } from "@/lib/authApi";

// ─── Inner page — uses useSearchParams, must be inside <Suspense> ─────────────
function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room")
    ? Number(searchParams.get("room"))
    : null;

  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // Optimistic messages shown while waiting for the server round-trip
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  // Clear optimistic messages on room change
  useEffect(() => {
    setOptimisticMessages([]);
  }, [roomId]);

  const { data: historyData, isLoading } = useGetChatHistoryQuery(roomId!, {
    skip: roomId === null,
  });

  const history = roomId === null ? [] : (historyData ?? []);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Merge server history + any pending optimistic messages
  const confirmedIds = new Set(history.map((m) => m.id));
  const pendingOptimistic = optimisticMessages.filter(
    (m) => m.id < 0 || !confirmedIds.has(m.id),
  );
  const messages: ChatMessage[] = [...history, ...pendingOptimistic];

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const text = inputValue.trim();
    setInputValue("");
    setFiles([]);

    // Show user message + thinking bubble optimistically right away
    const tempId = -Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      room: roomId ?? 0,
      sender: 0,
      message: text,
      ai_response: "…", // thinking indicator rendered as animated dots
      created_at: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, optimistic]);

    try {
      // Send with room if we have one, omit it for new chats
      const payload = roomId ? { room: roomId, message: text } : { message: text };
      const res = await sendMessage(payload).unwrap();

      // Remove the optimistic bubble
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));

      if (res.message) {
        const confirmedRoomId = res.message.room;

        if (!roomId) {
          // ── New chat: navigate to the room returned by the backend ──────────
          // The navigation will trigger a re-render with the new roomId, which
          // causes getChatHistory to fetch — so we don't need to store the
          // message in optimisticMessages (it will arrive via history).
          router.replace(`/dashboard?room=${confirmedRoomId}`);
        } else {
          // ── Existing chat: append confirmed message if not yet in history ──
          setOptimisticMessages((prev) => {
            const alreadyThere = history.some((h) => h.id === res.message.id);
            return alreadyThere ? prev : [...prev, res.message];
          });
        }
      }
    } catch {
      // Remove the optimistic bubble on failure so the user can retry
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return (
    <div className="w-full h-full bg-[#EFF2F6] relative overflow-hidden">
      {/* Only this inner div scrolls — MessageBox floats above it */}
      <div className="h-full overflow-y-auto pb-28">
        <MessageDisplay
          messages={messages}
          isLoading={isLoading}
          hasRoom={roomId !== null}
          isSending={isSending}
        />
      </div>
      <MessageBox
        message={inputValue}
        files={files}
        setMessage={setInputValue}
        setFiles={setFiles}
        onSend={handleSend}
        disabled={isSending}
      />
    </div>
  );
}

// ─── Page shell — wraps inner page in <Suspense> for useSearchParams ──────────
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full bg-[#EFF2F6]" />}>
      <ChatPage />
    </Suspense>
  );
}
