import {IResolvers, IResolverObject, IFieldResolver} from 'graphql-tools';
import UserAPI from './datasources/sql';

// fieldName: (parent, args, context, info) => data

interface ISource {}

interface IContext {
  dataSources: {
    sqlAPI: UserAPI;
  };
}

// BUILD QUERY

const launches: IFieldResolver<ISource, IContext> = async (
  _parent,
  {pageSize, after},
  {dataSources},
) => {
  return dataSources.sqlAPI.getAllChats({pageSize, after});
};

const launch: IFieldResolver<ISource, IContext> = async (
  _parent,
  {id},
  {dataSources},
) => {
  return dataSources.sqlAPI.getChatById({id});
};

const me: IFieldResolver<ISource, IContext> = async (
  _parent,
  _args,
  {dataSources},
) => {
  return dataSources.sqlAPI.findOrCreateUser();
};

const Query: IResolverObject<ISource, IContext> = {
  launches,
  launch,
  me,
};

// BUILD MUTATION

// BUILD RESOLVER

const resolvers: IResolvers<ISource, IContext> = {
  Query,
};

export default resolvers;
