import {ApolloServer} from 'apollo-server';

import typeDefs from './schema';
import {connectDatabase} from './utils';

import UserAPI from './data/user';

import 'reflect-metadata';

(async () => {
  const connection = await connectDatabase();

  // Set up any dataSources our resolvers need.
  const dataSources = () => ({
    userAPI: new UserAPI({connection}),
  });

  const server = new ApolloServer({
    typeDefs,
    dataSources,
  });

  // Start our server if we're not in a test env.
  if (process.env.NODE_ENV !== 'test') {
    const serverInfo = await server.listen({port: 4000});
    console.log(`🚀 app running at ${serverInfo.url}`);
  }
})();
