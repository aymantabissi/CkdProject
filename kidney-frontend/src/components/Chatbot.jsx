// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { text: "Salam! Ana NephroAI Assistant 🩺 — kif nqder n3awnk f-amrad l-klawi?", isBot: true },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const scrollRef               = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Désolé, kayna chi erreur f-l-connexion 😕", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: isOpen
            ? "rgba(255,255,255,0.15)"
            : "linear-gradient(135deg, #0ea5e9, #0d9488)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(14,165,233,0.35)",
        }}
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-[340px] h-[420px] rounded-3xl flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f2942 0%, #0d3d56 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Rainbow top strip */}
          <div className="h-0.5 w-full flex-shrink-0"
            style={{ background: "linear-gradient(90deg, #38bdf8, #34d399, #818cf8)" }} />

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.25)" }}
              >
                <svg className="w-4 h-4 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
                  <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-none">NephroAI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-sky-300/60">En ligne</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ scrollbarWidth: "none" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                {msg.isBot && (
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"
                    style={{ background: "rgba(56,189,248,0.15)" }}
                  >
                    <svg className="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                    msg.isBot ? "rounded-tl-sm" : "rounded-tr-sm"
                  }`}
                  style={
                    msg.isBot
                      ? { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.06)" }
                      : { background: "linear-gradient(135deg, #0ea5e9, #0d9488)", color: "#fff" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(56,189,248,0.15)" }}
                >
                  <svg className="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
                  </svg>
                </div>
                <div
                  className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex gap-1"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex items-center gap-2 rounded-2xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-transparent text-[12px] text-white placeholder-white/25 outline-none border-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-30"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[9px] text-white/15 mt-2">
              NephroAI · Clinical decision support only
            </p>
          </div>

        </div>
      )}
    </div>
  );
}