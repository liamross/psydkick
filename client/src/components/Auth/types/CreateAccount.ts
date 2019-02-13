/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount {
  /**
   * Returns login token. If null is returned, user already exists.
   */
  createAccount: string | null;
}

export interface CreateAccountVariables {
  name: string;
  password: string;
}
