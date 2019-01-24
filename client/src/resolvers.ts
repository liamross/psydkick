import gql from 'graphql-tag';
import {Resolvers} from 'apollo-client';

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
