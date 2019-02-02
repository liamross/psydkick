import {ApolloServer} from 'apollo-server';
import {Request} from 'express';
import 'reflect-metadata';
import SQLAPI from './datasources/sql';
import {User} from './models/user';
import resolvers from './resolvers';
import typeDefs from './schema';
import {connectDatabase, logger} from './utils';

(async () => {
  const connection = await connectDatabase();

  // Set up any dataSources our resolvers need.
  const dataSources = () => ({
    sqlAPI: new SQLAPI({connection}),
  });

  // Set up the global context for each resolver, using the req
  const context = async ({req}: {req: Request}) => {
    // Simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const name = Buffer.from(auth, 'base64').toString('ascii');

    if (name) {
      const userRepo = connection.getRepository(User);
      // Check for existing user.
      const existingUser = await userRepo.findOne({where: {name}});
      if (existingUser) return {user: existingUser};
    }

    return {user: null};
  };

  // Set up Apollo server.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
  });

  // Start our server if we're not in a test environment.
  if (process.env.NODE_ENV !== 'test') {
    const serverInfo = await server.listen({port: 4000});
    logger(`🚀 Server: ${serverInfo.url}`);
  }
})();
