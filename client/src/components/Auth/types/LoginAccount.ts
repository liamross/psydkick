/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginAccount
// ====================================================

export interface LoginAccount {
  /**
   * Returns login token. If null is returned, user does not exist.
   */
  login: string | null;
}

export interface LoginAccountVariables {
  name: string;
  password: string;
}
