/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllChats
// ====================================================

export interface AllChats_me_chatPage_chats_client {
  __typename: "UserInformation";
  id: string;
  name: string;
}

export interface AllChats_me_chatPage_chats_therapist {
  __typename: "UserInformation";
  id: string;
  name: string;
}

export interface AllChats_me_chatPage_chats {
  __typename: "Chat";
  id: string;
  createdAt: string;
  client: AllChats_me_chatPage_chats_client;
  therapist: AllChats_me_chatPage_chats_therapist;
}

export interface AllChats_me_chatPage {
  __typename: "ChatConnection";
  cursor: string | null;
  hasMore: boolean;
  chats: AllChats_me_chatPage_chats[];
}

export interface AllChats_me {
  __typename: "User";
  id: string;
  chatPage: AllChats_me_chatPage;
}

export interface AllChats {
  me: AllChats_me;
}

export interface AllChatsVariables {
  after?: string | null;
}
