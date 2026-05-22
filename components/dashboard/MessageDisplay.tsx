"use client";

import { FileText, ImageIcon } from "lucide-react";
import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Message } from "@/app/dashboard/page";

function getFilePreview(file: File) {
  if (file.type.startsWith("image/")) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="max-w-full h-auto max-h-100 object-contain rounded border"
      />
    );
  } else if (
    file.type === "application/pdf" ||
    file.type.includes("msword") ||
    file.type.includes("wordprocessingml")
  ) {
    return (
      <div className="w-20 h-20 flex items-center justify-center rounded border bg-white">
        <FileText className="w-10 h-10 text-dashboardMain" />
      </div>
    );
  } else {
    return (
      <div className="w-20 h-20 flex items-center justify-center rounded border bg-white">
        <ImageIcon className="w-10 h-10 text-dashboardMain" />
      </div>
    );
  }
}

function MessageDisplay({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: Function;
}) {
  const searchParams = useSearchParams(); // ✅ not array
  const assignmentId = searchParams.get("assignmentId");
  const chatId = searchParams.get("chatId");

  const isValidChat = assignmentId && chatId && messages.length > 0;

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [assignmentId, chatId]);

  return (
    <div className="flex-1 h-full w-full max-w-4xl mx-auto">
      {isValidChat ? (
        <div
          ref={messagesRef}
          className="overflow-y-auto space-y-4 h-full scrollbar scrollbar-thumb-rounded scrollbar-thumb-dashboardMain scrollbar-track-gray-200"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-dashboardMain text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}

                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.files.map((file: File, fidx: number) => (
                      <div key={fidx} className="relative">
                        {getFilePreview(file)}
                        <p className="text-xs mt-1 truncate max-w-25">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-end py-10 h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Hi, There!</h2>
            <p className="text-gray-500 mt-2">Let’s start the chat now!!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageDisplay;
