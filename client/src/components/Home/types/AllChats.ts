/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllChats
// ====================================================

export interface AllChats_me_chats_chats {
  __typename: 'Chat';
  id: string;
  createdAt: string;
  clientId: string;
  therapistId: string;
}

export interface AllChats_me_chats {
  __typename: 'ChatConnection';
  cursor: string | null;
  hasMore: boolean;
  chats: AllChats_me_chats_chats[];
}

export interface AllChats_me {
  __typename: 'User';
  chats: AllChats_me_chats;
}

export interface AllChats {
  me: AllChats_me | null;
}

export interface AllChatsVariables {
  after?: string | null;
}
