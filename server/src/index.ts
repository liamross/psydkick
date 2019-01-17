import {ApolloServer} from 'apollo-server';

import typeDefs from './schema';
import {connectDatabase} from './utils';

import UserAPI from './data/user';

import 'reflect-metadata';

// Creates a database connection once, NOT for every request.
connectDatabase().then(connection => {
  // Set up any dataSources our resolvers need.
  const dataSources = () => ({
    userAPI: new UserAPI(connection),
  });

  const server = new ApolloServer({
    typeDefs,
    dataSources,
  });

  // Start our server if we're not in a test env.
  if (process.env.NODE_ENV !== 'test')
    server
      .listen({port: 4000})
      .then(({url}) => console.log(`🚀 app running at ${url}`));
});
