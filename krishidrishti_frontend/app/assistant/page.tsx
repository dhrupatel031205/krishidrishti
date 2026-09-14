"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { sendAssistantMessage } from "@/lib/api/client";
import { ChatMessage } from "@/types";
import { mockInitialChatMessages } from "@/lib/mock/data";
import { SimulationBadge } from "@/components/common/StatCard";
import {
  Bot,
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  User,
  RefreshCw,
} from "lucide-react";

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockInitialChatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const reply = await sendAssistantMessage(messageText);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto flex flex-col" style={{ height: "calc(100dvh - 8rem)" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Bot className="h-6 w-6 text-emerald-700" />
                KrishiDrishti AI Assistant
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              Multilingual agricultural co-pilot trained on regional agronomy, plant pathology, and precision fertigation.
            </p>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-6 shadow-xs overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-stone-900 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm max-w-xl space-y-2 ${
                  msg.sender === "user"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-50 border border-stone-200/80 text-stone-800"
                }`}
              >
                <div className="leading-relaxed space-y-1">
                  {msg.content.split("\n").map((line, i) => {
                    // Render each line with inline bold (**text**) support
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <p key={i} className={line === "" ? "h-2" : ""}>
                        {parts.map((part, j) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={j}>{part.slice(2, -2)}</strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  })}
                </div>
                <div
                  className={`text-[10px] ${
                    msg.sender === "user" ? "text-stone-400" : "text-stone-400"
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Follow-up suggestions */}
                {msg.suggestedFollowUps && (
                  <div className="pt-2 border-t border-stone-200/60 mt-2 space-y-1.5">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Suggested Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(suggestion)}
                          className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[11px] text-stone-700 hover:border-emerald-500 hover:text-emerald-800 shadow-2xs text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-3.5 text-xs text-stone-500 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Assistant is consulting farm telemetry & agronomic database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-3 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about crop health, fertilizer schedule, or weather risks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
