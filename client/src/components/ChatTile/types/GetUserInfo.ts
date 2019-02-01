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
