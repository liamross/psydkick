import {gql} from 'apollo-server';

export default gql`
  type Query {
    me: User
  }

  type Mutation {
    sendMessage(
      """
      If chatId is not given, \`recipientId\` must be given. A new chat will be
      created for the message. This can only be done by the therapist.
      """
      chatId: ID
      """
      Recipient ID is not required unless no chatId is given, in which case
      providing it will create a new chat between the therapist and recipient.
      """
      recipientId: ID
      senderId: ID!
      content: String!
    ): MessageUpdateResponse!
    login(name: String): String # login token
  }

  type MessageUpdateResponse {
    success: Boolean!
    status: String
    message: Message
  }

  type User {
    id: ID!
    name: String!
    chats(
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
    cursor: String!
    hasMore: Boolean!
    chats: [Chat]!
  }

  type Chat {
    id: ID!
    clientId: ID!
    therapistId: ID!
    messages(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): MessageConnection
    message(id: ID!): Message
  }

  """
  Simple wrapper around our list of messages that contains a cursor to the last
  item in the list. Pass this cursor to the messages query to fetch the results
  after these.
  """
  type MessageConnection {
    cursor: String!
    hasMore: Boolean!
    messages: [Message]!
  }

  type Message {
    id: ID!
    content: String!
    senderId: ID!
    chatId: ID!
  }
`;
