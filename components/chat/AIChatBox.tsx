"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X, Send, Bot, ChevronRight } from "lucide-react";
import { aiChatService, AIChatResult } from "@/services/aiChatService";
import { type Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  text: "Xin chào! Tôi là trợ lý tư vấn của SmartPC Store. Bạn cần tôi giúp gì hôm nay? Tôi có thể tư vấn về cấu hình PC, linh kiện, hay tìm sản phẩm phù hợp với nhu cầu của bạn.",
};

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('111');
      const result: AIChatResult = await aiChatService.sendMessage(trimmed);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: result.answer,
        products: result.products.length > 0 ? result.products : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Xin lỗi, hiện tôi không thể kết nối. Vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="flex flex-col w-95 h-140 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Tư vấn AI</p>
              <p className="text-xs text-primary-foreground/70">SmartPC Store · Luôn sẵn sàng hỗ trợ</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Đóng chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Bot avatar */}
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0 mb-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start",
                    "max-w-[85%]"
                  )}
                >
                  {/* Text bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Product suggestions */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full">
                      <p className="text-xs text-muted-foreground mb-2 ml-1">
                        Sản phẩm gợi ý:
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {msg.products.map((product) => (
                          <ChatProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-border px-3 py-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 max-h-28 overflow-y-auto leading-relaxed"
              style={{ minHeight: "40px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 112) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Gửi tin nhắn"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110"
        )}
        aria-label={isOpen ? "Đóng tư vấn AI" : "Mở tư vấn AI"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}

function ChatProductCard({ product }: { product: Product }) {
  const isOutOfStock =
    product.stockStatus === "Out of stock" || product.quantity === 0;

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="flex flex-col shrink-0 w-32 rounded-xl border border-border bg-background hover:shadow-md hover:border-primary/40 transition-all overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-[10px] font-bold text-destructive border border-destructive px-1.5 py-0.5 -rotate-12">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2">
        <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight min-h-7.5">
          {product.name}
        </p>
        <p className="text-[11px] font-bold text-primary font-mono">
          {formatPrice(product.price)}
        </p>
        <span className="flex items-center gap-0.5 text-[10px] text-primary font-medium mt-0.5">
          Xem <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
