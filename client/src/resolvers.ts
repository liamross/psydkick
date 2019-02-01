import {Resolvers} from 'apollo-client';
import gql from 'graphql-tag';

export const initializers = {
  isLoggedIn: () => !!localStorage.getItem('token'),
};

// =============================================================================
// MUTATION RESOLVER
// -----------------------------------------------------------------------------

// const cacheSentMessage: CacheResolver = (
//   _,
//   {chatId, recipientId, content},
//   {cache},
// ) => {
//   // 1. Get all messages and chat for chatId or if it doesnt exist make one.
//   // 2.
//   const response = (cache as InMemoryCache).readQuery(
//     /* <AllChats, AllChatsVariables> */ {
//       query: GET_CHATS,
//     },
//   );
//   if (response && response.me && response.me.chats && response.me.chats.chats) {
//     const data = {
//       ...response,
//       me: {
//         ...response.me,
//         chats: {
//           ...response.me.chats,
//           chats: {
//             ...response.me.chats.chats,
//           },
//         },
//       },
//     };
//     cache.writeQuery({query: GET_CHATS, data});
//     return data.cartItems;
//   }
// };

// const Mutation = {cacheSentMessage};

// =============================================================================
// Bundle into resolvers object.
// -----------------------------------------------------------------------------

export const resolvers: Resolvers = {
  /* Mutation */
};

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }

  # extend type Mutation {
  # cacheSentMessage(
  #   """
  #   If the \`chatId\` of an existing chat is not given, \`recipientId\`
  #   **must** be provided in order to instantiate a new chat.
  #   """
  #   chatId: ID
  #   """
  #   The \`recipientId\` must not be provided unless no \`chatId\` is given, in
  #   which case it **must** be provided in order to instantiate a new chat
  #   between the therapist (sender) and recipient.
  #   """
  #   recipientId: ID
  #   content: String!
  # ): Message!
  # }
`;
