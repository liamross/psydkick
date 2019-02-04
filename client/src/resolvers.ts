import {Resolvers} from 'apollo-client';
import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const initializers = {
  isLoggedIn: () => !!localStorage.getItem('token'),
};

// =============================================================================
// Bundle into resolvers object.
// -----------------------------------------------------------------------------

export const resolvers: Resolvers = {
  /* No resolvers yet. */
};
