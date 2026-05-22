"use client";
import { useState } from "react";
import MessageBox from "@/components/dashboard/MessageInput";
import MessageDisplay from "@/components/dashboard/MessageDisplay";

export interface Message {
  text: string;
  sender: "user" | "bot";
  files?: File[];
}

export default function page() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      console.log(
        "Sending message:",
        message,
        "with files:",
        files.map((f) => f.name),
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "bot", files },
      ]);
      setMessage("");
      setFiles([]);
    }
  };
  return (
    <div className="w-full h-full bg-[#EFF2F6] relative overflow-y-auto pb-20">
      <MessageDisplay setMessages={setMessages} messages={messages} />
      {/* chat box part  */}
      <MessageBox
        message={message}
        files={files}
        setMessage={setMessage}
        setFiles={setFiles}
        onSend={handleSend}
      />
    </div>
  );
}
