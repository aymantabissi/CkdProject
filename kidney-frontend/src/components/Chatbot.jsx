import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Salam! Ana NephroAI Bot 🩺. Ki nqder n3awnk f-amrad l-klowi?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Bach dima y-skrolli l-taht mli y-ji message jdid
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Désolé, kayna chi erreur f-l-connexion 😕", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Le bouton rond (style ONCF) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-3xl hover:bg-blue-700 hover:scale-110 transition-all duration-300 active:scale-95"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* La fenêtre de chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4">

          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🩺</div>
              <div>
                <h3 className="font-bold text-sm">NephroAI Assistant</h3>
                <p className="text-[10px] text-blue-100">En ligne pour vous aider</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.isBot
                    ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none animate-pulse text-xs text-gray-500">
                  NephroAI t-yfekker...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}