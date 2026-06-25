import React, { useRef } from "react";
import { Paperclip, Send, X, FileText, Image as ImageIcon } from "lucide-react";

export default function MessageBox({
  message,
  files,
  setMessage,
  setFiles,
  onSend,
  disabled = false,
}: {
  message: any;
  files: File[];
  setMessage: Function;
  setFiles: Function;
  onSend: Function;
  disabled?: boolean;
}) {
  const handleSend = () => {
    onSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles: File[]) => prevFiles.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-8 h-8 object-cover rounded"
        />
      );
    } else if (
      file.type === "application/pdf" ||
      file.type.includes("msword") ||
      file.type.includes("wordprocessingml")
    ) {
      return <FileText className="w-8 h-8 text-gray-500" />;
    } else {
      return <ImageIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-end w-full absolute bottom-5 gap-2 px-3 ">
      {files.length > 0 && (
        <div className="w-full max-w-4xl flex flex-wrap gap-2 px-4 mx-3">
          {files.map((file, index) => (
            <div key={index} className="relative shrink-0">
              <div className="w-8 h-8">{getFilePreview(file)}</div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow hover:cursor-pointer"
                aria-label="Remove file"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="w-full max-w-4xl bg-white rounded-full shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-200 mx-3">
        {/* Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Start chat"
          className="flex-1 py-3 md:py-2 ps-4 rounded-full outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base min-w-0 bg-[#EFF2F6] md:min-w-100"
        />

        {/* Voice Button */}
        {/* <button
          className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Voice input"
        >
          <Mic className="w-5 h-5 text-gray-500" />
        </button> */}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && files.length === 0)}
          className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
