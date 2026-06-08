import { useChat } from "./chatState";

export default function ChatSidebar() {
  const { conversations, activeConversation, setActiveConversation, searchQuery, setSearchQuery } = useChat();

  return (
    <div className="flex w-80 flex-col border-r border-slate-800 bg-black/50">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Mensagens</h1>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-800/50 px-4 py-2 text-sm text-slate-200 outline-none ring-1 ring-slate-700 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {conversations.map((conv) => {
          const contact = conv.participants[0];
          const isActive = activeConversation?.id === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 transition ${
                isActive ? 'bg-blue-600/10 ring-1 ring-blue-600/50' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {contact.nome.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-bold ${isActive ? 'text-blue-400' : 'text-slate-100'}`}>{contact.nome}</p>
                <p className="truncate text-xs text-slate-500">{conv.lastMessage?.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
