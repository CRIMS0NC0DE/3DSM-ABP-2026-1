import { useChat } from "./ChatContext";

export default function ChatHeader() {
  const { activeConversation } = useChat();
  if (!activeConversation) return null;

  const contact = activeConversation.participants[0];

  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {contact.nome.charAt(0)}
          </div>
          {contact.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100">{contact.nome}</h2>
          <p className="text-xs text-slate-400">
            {contact.online ? 'Online agora' : 'Visto por último recentemente'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {/* Ações futuras: Telefone, Vídeo, Info */}
      </div>
    </div>
  );
}