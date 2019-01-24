import gql from 'graphql-tag';
import {Resolvers} from 'apollo-client';

export const initializers = {
  isLoggedIn: () => !!localStorage.getItem('token'),
};

export const resolvers: Resolvers = {
  Launch: {},
  Mutation: {},
};

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [Launch]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;
