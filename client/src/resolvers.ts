import {Resolvers} from 'apollo-client';
import gql from 'graphql-tag';

export const initializers = {
  isLoggedIn: () => !!localStorage.getItem('token'),
};

export const resolvers: Resolvers = {
  Mutation: {},
};

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }

  # extend type Mutation {
  # }
`;
