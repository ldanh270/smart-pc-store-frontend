"use client"

import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AIChatResult, aiChatService } from "@/services/aiChatService"
import { type Product } from "@/types/product"

import { KeyboardEvent, useEffect, useRef, useState } from "react"

import { Bot, ChevronRight, MessageCircle, Send, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  text: string
  products?: Product[]
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  text: "Xin chào! Tôi là trợ lý tư vấn của SmartPC Store. Bạn cần tôi giúp gì hôm nay? Tôi có thể tư vấn về cấu hình PC, linh kiện, hay tìm sản phẩm phù hợp với nhu cầu của bạn.",
}

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [isOpen, messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      console.log("111")
      const result: AIChatResult = await aiChatService.sendMessage(trimmed)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: result.answer,
        products: result.products.length > 0 ? result.products : undefined,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Xin lỗi, hiện tôi không thể kết nối. Vui lòng thử lại sau.",
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="border-border bg-background flex h-140 w-95 flex-col overflow-hidden rounded-2xl border shadow-2xl">
          {/* Header */}
          <div className="bg-primary text-primary-foreground flex shrink-0 items-center gap-3 px-4 py-3">
            <div className="bg-primary-foreground/20 flex h-9 w-9 items-center justify-center rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-tight font-semibold">Tư vấn AI</p>
              <p className="text-primary-foreground/70 text-xs">
                SmartPC Store · Luôn sẵn sàng hỗ trợ
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
              aria-label="Đóng chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {/* Bot avatar */}
                {msg.role === "assistant" && (
                  <div className="bg-primary/10 text-primary mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start",
                    "max-w-[85%]",
                  )}
                >
                  {/* Text bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm",
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Product suggestions */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full">
                      <p className="text-muted-foreground mb-2 ml-1 text-xs">Sản phẩm gợi ý:</p>
                      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
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
                <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-border flex shrink-0 items-end gap-2 border-t px-3 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              rows={1}
              disabled={isLoading}
              className="border-input bg-background placeholder:text-muted-foreground focus:ring-primary/50 max-h-28 flex-1 resize-none overflow-y-auto rounded-xl border px-3 py-2.5 text-sm leading-relaxed focus:ring-2 focus:outline-none disabled:opacity-50"
              style={{ minHeight: "40px" }}
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = "auto"
                el.style.height = Math.min(el.scrollHeight, 112) + "px"
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
          "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110",
        )}
        aria-label={isOpen ? "Đóng tư vấn AI" : "Mở tư vấn AI"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  )
}

function ChatProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === "Out of stock" || product.quantity === 0

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="border-border bg-background hover:border-primary/40 group flex w-32 shrink-0 flex-col overflow-hidden rounded-xl border transition-all hover:shadow-md"
    >
      {/* Image */}
      <div className="bg-secondary relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
            <span className="text-destructive border-destructive -rotate-12 border px-1.5 py-0.5 text-[10px] font-bold">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2">
        <p className="text-foreground line-clamp-2 min-h-7.5 text-[11px] leading-tight font-medium">
          {product.name}
        </p>
        <p className="text-primary font-mono text-[11px] font-bold">{formatPrice(product.price)}</p>
        <span className="text-primary mt-0.5 flex items-center gap-0.5 text-[10px] font-medium">
          Xem <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-muted-foreground/50 h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
