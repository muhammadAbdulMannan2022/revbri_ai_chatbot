"use client";

import { useRef, useEffect } from "react";
import {
  Bot,
  ExternalLink,
  Loader2,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import type { ChatMessage, ChatProductResponse } from "@/lib/authApi";
import Markdown from "react-markdown";

// ─── Type guards ──────────────────────────────────────────────────────────────
function isProductResponse(v: unknown): v is ChatProductResponse {
  return typeof v === "object" && v !== null && "results" in v;
}

function isErrorResponse(v: unknown): v is { error: string; source?: string } {
  return typeof v === "object" && v !== null && "error" in v;
}

// ─── Thinking bubble shown while AI is generating ────────────────────────────
function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-2 max-w-[80%]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ef5b5e] to-[#ff8a70] shadow-sm">
          <Bot size={14} className="text-white" strokeWidth={2} />
        </div>
        <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#ef5b5e] [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#ef5b5e] [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#ef5b5e] [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
}: {
  product: ChatProductResponse["results"][number];
}) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-[12px] border border-[#edf0f4] bg-white shadow-sm transition hover:shadow-md hover:border-[#ef5b5e]/30"
    >
      {/* Image */}
      <div className="relative h-[110px] w-full overflow-hidden bg-[#f8fafc]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={28} className="text-[#cbd5e1]" />
          </div>
        )}
        {product.price && (
          <span className="absolute left-2 top-2 rounded-full bg-[#ef5b5e] px-2 py-0.5 text-[10px] font-bold text-white shadow">
            ${product.price}
          </span>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[12px] font-bold text-[#151b26] leading-tight line-clamp-1 group-hover:text-[#ef5b5e] transition">
          {product.name}
        </p>
        <p className="text-[10px] text-[#94a3b8] line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-auto flex items-center gap-1 pt-1">
          <ExternalLink size={10} className="text-[#ef5b5e]" />
          <span className="text-[10px] font-semibold text-[#ef5b5e]">View</span>
        </div>
      </div>
    </a>
  );
}

// ─── AI response bubble ───────────────────────────────────────────────────────
function AIBubble({
  response,
}: {
  response: string | ChatProductResponse | { error: string; source?: string };
}) {
  const isThinking = response === "…";

  if (isThinking) return <ThinkingBubble />;

  // Backend returned an error object (e.g. OpenAI quota exceeded)
  if (isErrorResponse(response)) {
    return (
      <div className="flex justify-start">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ef5b5e] to-[#ff8a70] shadow-sm">
            <Bot size={14} className="text-white" strokeWidth={2} />
          </div>
          <div className="rounded-2xl rounded-bl-sm border border-red-100 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-600 shadow-sm">
            ⚠️ The AI couldn&apos;t respond right now. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  if (isProductResponse(response)) {
    const { query, results } = response;
    return (
      <div className="flex justify-start">
        <div className="flex items-end gap-2 max-w-[90%] w-full">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ef5b5e] to-[#ff8a70] shadow-sm">
            <Bot size={14} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            {/* Query echo */}
            <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-[13px] text-[#374151] shadow-sm">
              {results.length === 0 ? (
                <p>
                  I searched for{" "}
                  <span className="font-semibold text-[#ef5b5e]">
                    &ldquo;{query}&rdquo;
                  </span>{" "}
                  but couldn&apos;t find any matching products. Try adjusting
                  your query!
                </p>
              ) : (
                <p>
                  Here are{" "}
                  <span className="font-semibold text-[#ef5b5e]">
                    {results.length} product{results.length !== 1 ? "s" : ""}
                  </span>{" "}
                  matching{" "}
                  <span className="font-semibold">&ldquo;{query}&rdquo;</span>:
                </p>
              )}
            </div>
            {/* Product grid */}
            {results.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Plain text response
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-2 max-w-[80%]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ef5b5e] to-[#ff8a70] shadow-sm">
          <Bot size={14} className="text-white" strokeWidth={2} />
        </div>
        <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-[13px] leading-relaxed text-[#374151] shadow-sm whitespace-pre-wrap">
          <Markdown>{response}</Markdown>
        </div>
      </div>
    </div>
  );
}

// ─── User bubble ──────────────────────────────────────────────────────────────
function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-gradient-to-br from-[#ef5b5e] to-[#ff7b6b] px-4 py-3 text-[13px] leading-relaxed text-white shadow-sm">
        {text}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasRoom }: { hasRoom: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ef5b5e]/10 to-[#ff8a70]/10">
        <MessageSquare size={28} className="text-[#ef5b5e]" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h2 className="text-[18px] font-extrabold text-[#151b26]">
          {hasRoom ? "Start the conversation!" : "Select a chat"}
        </h2>
        <p className="mt-1 text-[13px] text-[#94a3b8]">
          {hasRoom
            ? "Ask me anything or search for products."
            : "Pick an existing chat or create a new one from the sidebar."}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function MessageDisplay({
  messages,
  isLoading,
  hasRoom,
  isSending,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  hasRoom: boolean;
  isSending?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#ef5b5e]" />
      </div>
    );
  }

  // Show empty state when there are no messages yet.
  // We intentionally do NOT gate on hasRoom here — when a new chat is started
  // (no room yet) the optimistic message should still appear immediately.
  if (messages.length === 0) {
    return <EmptyState hasRoom={hasRoom} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full max-w-4xl mx-auto px-4 pt-6 pb-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col gap-2">
          {/* User message */}
          <UserBubble text={msg.message} />
          {/* AI response */}
          <AIBubble response={msg.ai_response} />
        </div>
      ))}
      {/* Anchor for auto-scroll */}
      <div className=" md:border-[4rem] border-[#EFF2F6]" ref={bottomRef} />
    </div>
  );
}

export default MessageDisplay;
