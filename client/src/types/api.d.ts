/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllChats
// ====================================================

export interface AllChats_me_chats_chats {
  __typename: "Chat";
  id: string;
  createdAt: string;
  clientId: string;
  therapistId: string;
}

export interface AllChats_me_chats {
  __typename: "ChatConnection";
  cursor: string | null;
  hasMore: boolean;
  chats: AllChats_me_chats_chats[];
}

export interface AllChats_me {
  __typename: "User";
  chats: AllChats_me_chats;
}

export interface AllChats {
  me: AllChats_me | null;
}

export interface AllChatsVariables {
  after?: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserInfo
// ====================================================

export interface GetUserInfo_therapist {
  __typename: "UserInformation";
  name: string;
}

export interface GetUserInfo_client {
  __typename: "UserInformation";
  name: string;
}

export interface GetUserInfo {
  /**
   * Must provide `id` and/or `name`.
   */
  therapist: GetUserInfo_therapist | null;
  /**
   * Must provide `id` and/or `name`.
   */
  client: GetUserInfo_client | null;
}

export interface GetUserInfoVariables {
  therapistId: string;
  clientId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login {
  login: string | null;
}

export interface LoginVariables {
  name: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount {
  createAccount: string | null;
}

export interface CreateAccountVariables {
  name: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IsUserLoggedIn
// ====================================================

export interface IsUserLoggedIn {
  isLoggedIn: boolean;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
