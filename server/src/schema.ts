import { gql } from 'apollo-server';

export default gql`
  type Query {
    # Returns a page of chats
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
    # Returns a specific chat
    chat(id: ID!): Chat
    # Queries for the current user
    me: User
  }

  type Mutation {
    # if false, send message failed -- check errors
    sendMessage(chat: ID!, content: String!): MessageUpdateResponse!
    # if false, read receipt failed -- check errors
    readMessages(chat: ID!, messages: [ID]!): MessageUpdateResponse!
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
    others: [User]!
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
    # Returns a specific message
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
    # TODO: Decide how to handle date+time
    sent: String!
  }
`;
