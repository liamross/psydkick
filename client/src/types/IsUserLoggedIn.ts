/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IsUserLoggedIn
// ====================================================

export interface IsUserLoggedIn_me {
  __typename: 'User';
  id: string;
}

export interface IsUserLoggedIn {
  me: IsUserLoggedIn_me | null;
  isLoggedIn: boolean;
}
