import React, { useState } from "react";
import { useChat } from "./chatState";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useChat();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <form 
      onSubmit={handleSend}
      className="border-t border-slate-800 bg-slate-900/50 p-4"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-slate-800/50 px-4 py-2 ring-1 ring-slate-700 focus-within:ring-blue-500/50">
        <button type="button" className="text-slate-400 hover:text-slate-200 transition">
          <span className="text-xl">😊</span>
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="flex-1 bg-transparent py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ENVIAR
        </button>
      </div>
    </form>
  );
}
