import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Conversation, Message, ChatUser } from './index';
import { mockConversations, mockMessages, mockUsers } from './data';
import { useAuth } from '../contexts/AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Message[];
  sendMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filter: 'all' | 'online';
  setFilter: (f: 'all' | 'online') => void;
  startConversation: (user: ChatUser) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const messages = activeConversation ? (allMessages[activeConversation.id] || []) : [];

  const filteredConversations = conversations.filter(conv => {
    const contact = conv.participants[0];
    const matchesSearch = contact.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || contact.online;
    return matchesSearch && matchesFilter;
  });

  const startConversation = (contact: ChatUser) => {
    const existing = conversations.find(c => c.participants.some(p => p.id === contact.id));
    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv: Conversation = {
        id: `c${Date.now()}`,
        participants: [contact],
        updatedAt: new Date().toISOString(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversation(newConv);
    }
  };

  const sendMessage = (text: string) => {
    if (!activeConversation || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: activeConversation.id,
      senderId: 'me', // Simulando o ID do usuário logado
      text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setAllMessages(prev => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMessage]
    }));

    // Simulação de resposta automática (Mock Real-time)
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: activeConversation.id,
        senderId: activeConversation.participants[0].id,
        text: `Recebi sua mensagem: "${text}". Vou verificar agora mesmo.`,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };
      setAllMessages(prev => ({
        ...prev,
        [activeConversation.id]: [...(prev[activeConversation.id] || []), reply]
      }));
    }, 1500);
  };

  return (
    <ChatContext.Provider value={{ 
      conversations: filteredConversations, 
      activeConversation, setActiveConversation, 
      messages, sendMessage, searchQuery, setSearchQuery, 
      filter, setFilter, startConversation,
      isLoading 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};