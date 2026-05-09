import type { ChatUser, Conversation, Message } from "./index";

export const mockUsers: ChatUser[] = [
  { id: 'u1', nome: 'Márcio Bueno', online: true, avatar: '' },
  { id: 'u2', nome: 'Vinícius Oliveira', online: false, avatar: '' },
  { id: 'u3', nome: 'Davi Snaider', online: true, avatar: '' },
  { id: 'u4', nome: 'Eric França', online: true, avatar: '' },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [mockUsers[0]],
    updatedAt: new Date().toISOString(),
    lastMessage: {
      id: 'm1',
      conversationId: 'c1',
      senderId: 'u1',
      text: 'Olá, como está o estoque do Honda Civic?',
      timestamp: new Date().toISOString(),
      status: 'read'
    }
  },
  {
    id: 'c2',
    participants: [mockUsers[1]],
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessage: {
      id: 'm2',
      conversationId: 'c2',
      senderId: 'u2',
      text: 'O cliente aprovou o financiamento.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'delivered'
    }
  }
];

export const mockMessages: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm0',
      conversationId: 'c1',
      senderId: 'u1',
      text: 'Bom dia!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'read'
    },
  ]
};