import { ChatProvider } from "./ChatContext";
import { useChat } from "./chatState";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

function ChatContent() {
  const { activeConversation } = useChat();

  return (
    <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/50 shadow-2xl">
      <ChatSidebar />
      <div className="flex flex-1 flex-col bg-gradient-to-b from-slate-900/50 to-slate-950">
        {activeConversation ? (
          <>
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-6xl opacity-20">💬</div>
            <h3 className="text-xl font-bold text-slate-100">Selecione uma conversa</h3>
            <p className="mt-2 text-sm text-slate-500">Inicie um bate-papo com sua equipe ou clientes da intranet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <main className="p-4 lg:p-8">
        <ChatContent />
      </main>
    </ChatProvider>
  );
}
