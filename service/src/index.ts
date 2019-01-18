import {ApolloServer} from 'apollo-server';

import typeDefs from './schema';
import resolvers from './resolvers';

import {connectDatabase} from './utils';

import SQLAPI from './datasources/sql';

import 'reflect-metadata';

(async () => {
  const connection = await connectDatabase();

  // Set up any dataSources our resolvers need.
  const dataSources = () => ({
    sqlAPI: new SQLAPI({connection}),
  });

  // Set up Apollo server.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
  });

  // Start our server if we're not in a test environment.
  if (process.env.NODE_ENV !== 'test') {
    const serverInfo = await server.listen({port: 4000});
    console.log(`🚀 app running at ${serverInfo.url}\n`);
  }
})();
