import { createContext, useContext } from "react";

import type { ChatUser, Conversation, Message } from "./index";

export interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Message[];
  sendMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filter: "all" | "online";
  setFilter: (f: "all" | "online") => void;
  startConversation: (user: ChatUser) => void;
  isLoading: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
}
