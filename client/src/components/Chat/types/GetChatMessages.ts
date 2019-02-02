/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChatMessages
// ====================================================

export interface GetChatMessages_me_chat_client {
  __typename: "UserInformation";
  id: string;
}

export interface GetChatMessages_me_chat_therapist {
  __typename: "UserInformation";
  id: string;
}

export interface GetChatMessages_me_chat_messagePage_messages_sender {
  __typename: "UserInformation";
  id: string;
}

export interface GetChatMessages_me_chat_messagePage_messages {
  __typename: "Message";
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  sender: GetChatMessages_me_chat_messagePage_messages_sender;
  chatId: string;
}

export interface GetChatMessages_me_chat_messagePage {
  __typename: "MessageConnection";
  messages: GetChatMessages_me_chat_messagePage_messages[];
}

export interface GetChatMessages_me_chat {
  __typename: "Chat";
  id: string;
  createdAt: string;
  updatedAt: string;
  client: GetChatMessages_me_chat_client;
  therapist: GetChatMessages_me_chat_therapist;
  messagePage: GetChatMessages_me_chat_messagePage;
}

export interface GetChatMessages_me {
  __typename: "User";
  chat: GetChatMessages_me_chat | null;
}

export interface GetChatMessages {
  me: GetChatMessages_me;
}

export interface GetChatMessagesVariables {
  chatId: string;
  after?: string | null;
}
