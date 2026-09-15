"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { sendAssistantMessage } from "@/lib/api/client";
import { ChatMessage } from "@/types";
import { mockInitialChatMessages, getInitialChatMessages } from "@/lib/mock/data";
import { SimulationBadge } from "@/components/common/StatCard";
import { useLanguage } from "@/lib/context/LanguageContext";
import {
  Bot,
  Send,
  User,
  RefreshCw,
} from "lucide-react";
import { DownloadReportButton } from "@/components/common/DownloadReportButton";

const ASSISTANT_UI = {
  en: {
    title: "KrishiDrishti AI Assistant",
    subtitle: "Multilingual agricultural co-pilot trained on regional agronomy, plant pathology, and precision fertigation.",
    placeholder: "Ask about crop health, fertilizer schedule, or weather risks...",
    thinking: "Assistant is consulting farm telemetry & agronomic database...",
    suggested: "Suggested Questions:",
  },
  hi: {
    title: "कृषि दृष्टि एआई सहायक",
    subtitle: "क्षेत्रीय कृषि विज्ञान, पादप रोग विज्ञान और सटीक सिंचाई पर प्रशिक्षित बहुभाषी कृषि सह-पायलट।",
    placeholder: "फसल स्वास्थ्य, उर्वरक कार्यक्रम या मौसम जोखिम के बारे में पूछें...",
    thinking: "सहायक कृषि डेटाबेस से जानकारी प्राप्त कर रहा है...",
    suggested: "सुझाए गए प्रश्न:",
  },
  pa: {
    title: "ਕ੍ਰਿਸ਼ੀ ਦ੍ਰਿਸ਼ਟੀ ਏਆਈ ਸਹਾਇਕ",
    subtitle: "ਖੇਤਰੀ ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨ ਅਤੇ ਸਿੰਚਾਈ ਤੇ ਸਿਖਲਾਈ ਪ੍ਰਾਪਤ ਬਹੁ-ਭਾਸ਼ਾਈ ਖੇਤੀ ਸਹਾਇਕ।",
    placeholder: "ਫ਼ਸਲ ਦੀ ਸਿਹਤ, ਖਾਦ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",
    thinking: "ਸਹਾਇਕ ਖੇਤੀ ਡੇਟਾਬੇਸ ਤੋਂ ਜਾਣਕਾਰੀ ਲੈ ਰਿਹਾ ਹੈ...",
    suggested: "ਸੁਝਾਏ ਗਏ ਸਵਾਲ:",
  },
  te: {
    title: "కృషి దృష్టి ఏఐ సహాయకుడు",
    subtitle: "ప్రాంతీయ వ్యవసాయ శాస్త్రం మరియు నీటిపారుదలపై శిక్షణ పొందిన బహుభాషా వ్యవసాయ సహాయకుడు.",
    placeholder: "పంట ఆరోగ్యం, ఎరువులు లేదా వాతావరణ నష్టాల గురించి అడగండి...",
    thinking: "సహాయకుడు వ్యవసాయ డేటాబేస్ నుండి సమాచారం తీసుకుంటున్నాడు...",
    suggested: "సూచించిన ప్రశ్నలు:",
  },
  gu: {
    title: "કૃષિ દૃષ્ટિ AI સહાયક",
    subtitle: "પ્રાદેશિક કૃષિ વિજ્ઞાન, વનસ્પતિ રોગ વિજ્ઞાન અને ચોક્કસ સિંચાઈ પર પ્રશિક્ષિત બહુભાષી કૃષિ સહ-પાઇલટ.",
    placeholder: "પાક આરોગ્ય, ખાતર સમયપત્રક અથવા હવામાન જોખમ વિશે પૂછો...",
    thinking: "સહાયક કૃષિ ડેટાબેઝ પરામર્શ કરી રહ્યો છે...",
    suggested: "સૂચવેલ પ્રશ્નો:",
  },
};

export default function AssistantPage() {
  const { language } = useLanguage();
  const ui = ASSISTANT_UI[language] ?? ASSISTANT_UI.en;

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialChatMessages(language));
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
      const reply = await sendAssistantMessage(messageText, undefined, language, [...messages, userMsg]);
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
                {ui.title}
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {ui.subtitle}
            </p>
          </div>
          {messages.length > 1 && (
            <DownloadReportButton
              reportTitle="AI Assistant Chat Export"
              getData={() => ({
                conversation: messages.map((m) => ({
                  role: m.sender === "user" ? "User" : "Assistant",
                  message: m.content,
                  time: m.timestamp,
                })),
              })}
            />
          )}
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
                      {ui.suggested}
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
                <span>{ui.thinking}</span>
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
              placeholder={ui.placeholder}
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
