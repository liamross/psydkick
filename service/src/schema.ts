import {gql} from 'apollo-server';

export default gql`
  type Query {
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
    me: User
  }

  type Mutation {
    sendMessage(
      chatId: ID!
      senderId: ID!
      content: String!
    ): MessageUpdateResponse!
    login(name: String): String # login token
  }

  type MessageUpdateResponse {
    success: Boolean!
    status: String
    messages: [Message]
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
    members: [User]!
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

  type User {
    id: ID!
    name: String!
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
    read: [ID]! # IDs of everyone who has read the message
    sent: String! # TODO: Decide how to handle date+time
  }
`;
