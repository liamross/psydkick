import {gql} from 'apollo-server';

export default gql`
  type Query {
    me: User
    """
    Must provide \`id\` and/or \`name\`.
    """
    userInfo(id: ID, name: String): UserInformation
  }

  type Mutation {
    sendMessage(
      """
      If the \`chatId\` of an existing chat is not given, \`recipientId\`
      **must** be provided in order to instantiate a new chat.
      """
      chatId: ID
      """
      The \`recipientId\` must not be provided unless no \`chatId\` is given, in
      which case it **must** be provided in order to instantiate a new chat
      between the therapist (sender) and recipient.
      """
      recipientId: ID
      content: String!
    ): Message!
    login(name: String!): String # login token
    createAccount(name: String!): String # login token
  }

  type UserInformation {
    id: ID!
    name: String!
  }

  type User { # TODO: implement user information?
    id: ID!
    name: String!
    chatPage(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): ChatConnection!
    chat(id: ID!): Chat
  }

  """
  Simple wrapper around our list of chats that contains a cursor to the last
  item in the list. Pass this cursor to the chats query to fetch the results
  after these.
  """
  type ChatConnection {
    cursor: String
    hasMore: Boolean!
    chats: [Chat!]!
  }

  type Chat {
    id: ID!
    createdAt: String!
    updatedAt: String!
    client: UserInformation!
    therapist: UserInformation!
    messagePage(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): MessageConnection!
    message(id: ID!): Message
  }

  """
  Simple wrapper around our list of messages that contains a cursor to the last
  item in the list. Pass this cursor to the messages query to fetch the results
  after these.
  """
  type MessageConnection {
    cursor: String
    hasMore: Boolean!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    createdAt: String!
    updatedAt: String!
    content: String!
    sender: UserInformation!
    chat: Chat!
  }
`;
