/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChatMessages
// ====================================================

export interface GetChatMessages_me_chat_messages_messages {
  __typename: 'Message';
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  senderId: string;
  chatId: string;
}

export interface GetChatMessages_me_chat_messages {
  __typename: 'MessageConnection';
  messages: GetChatMessages_me_chat_messages_messages[];
}

export interface GetChatMessages_me_chat {
  __typename: 'Chat';
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  therapistId: string;
  messages: GetChatMessages_me_chat_messages;
}

export interface GetChatMessages_me {
  __typename: 'User';
  chat: GetChatMessages_me_chat | null;
}

export interface GetChatMessages {
  me: GetChatMessages_me | null;
}

export interface GetChatMessagesVariables {
  chatId: string;
  after?: string | null;
}
