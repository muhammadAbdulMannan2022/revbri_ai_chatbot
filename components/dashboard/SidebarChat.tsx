"use client";

import { useGetChatsQuery } from "@/lib/authApi";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Chat = {
  id: number;
  name: string;
};

export default function SidebarChatList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("room")
    ? Number(searchParams.get("room"))
    : null;

  const [chats, setChats] = useState<Chat[]>([]);
  const [actionOpenId, setActionOpenId] = useState<number | null>(null);
  const { data: chatsData, isLoading: isChatsLoading } = useGetChatsQuery();

  // Close action dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActionOpenId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isChatsLoading && chatsData) {
      const raw = Array.isArray(chatsData)
        ? chatsData
        : (chatsData as any)?.results ?? [];
      setChats(raw);
    }
  }, [chatsData, isChatsLoading]);

  const handleSelectChat = (id: number) => {
    setActionOpenId(null);
    router.push(`/dashboard?room=${id}`);
  };

  const handleCreateNewChat = () => {
    setActionOpenId(null);
    router.push("/dashboard");
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    setActionOpenId(null);
    if (activeId === id) router.push("/dashboard");
  };

  return (
    <div suppressHydrationWarning className="w-full bg-white flex flex-col">
      {/* New Chat Button */}
      <div className="bg-white sticky top-0 z-10">
        <button
          onClick={handleCreateNewChat}
          className="flex items-center justify-center gap-2 w-full p-3 mb-6 border border-gray-200 rounded-lg text-[#FD6E6E] hover:cursor-pointer hover:bg-gray-100 transition-colors font-medium"
        >
          <SquarePen size={18} />
          <span>New chat</span>
        </button>
      </div>

      {/* List Header */}
      <h2 className="text-gray-500 text-xs font-semibold uppercase mb-3 px-1">
        List of Chats
      </h2>

      {/* Chat Items */}
      <div className="flex-1 space-y-1">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`group flex items-center border border-gray-50 justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors relative ${
                activeId === chat.id
                  ? "bg-[#ff5a5a] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="truncate pr-2">{chat.name}</span>

              <div className="relative flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActionOpenId(actionOpenId === chat.id ? null : chat.id);
                  }}
                  className={`p-1 rounded transition-opacity hover:cursor-pointer ${
                    actionOpenId === chat.id
                      ? "opacity-100 bg-black/10"
                      : "opacity-0 group-hover:opacity-100 hover:bg-black/10"
                  }`}
                >
                  <MoreVertical size={16} />
                </button>

                {actionOpenId === chat.id && (
                  <>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-[110%] mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30 text-gray-700"
                    >
                      <button
                        onClick={(e) => handleDelete(e, chat.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete chat</span>
                      </button>
                    </div>
                    <span className="w-4 h-5 bg-white absolute rotate-45 top-[110%] right-2 border border-gray-300" />
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No chats available.</p>
            <p className="mt-1">Click &quot;New chat&quot; to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
