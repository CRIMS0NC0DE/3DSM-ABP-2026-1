import { useEffect, useRef } from "react";
import { useChat } from "./chatState";

export default function ChatMessages() {
  const { messages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
    >
      {messages.map((msg) => {
        const isMe = msg.senderId === 'me';
        return (
          <div 
            key={msg.id} 
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
              isMe 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`mt-1 flex items-center gap-1 text-[10px] ${
                isMe ? 'text-blue-100' : 'text-slate-500'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && (
                  <span>{msg.status === 'read' ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
