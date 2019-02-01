/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendMessage
// ====================================================

export interface SendMessage_sendMessage {
  __typename: "Message";
  chatId: string;
  content: string;
  createdAt: string;
  id: string;
  senderId: string;
  updatedAt: string;
}

export interface SendMessage {
  sendMessage: SendMessage_sendMessage;
}

export interface SendMessageVariables {
  chatId?: string | null;
  recipientId?: string | null;
  content: string;
}
