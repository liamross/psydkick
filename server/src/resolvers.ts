import {IFieldResolver, IResolverObject, IResolvers} from 'graphql-tools';
import UserAPI from './datasources/sql';
import {Chat as ChatModel} from './models/chat';
import {Message as MessageModel} from './models/message';
import {User as UserModel} from './models/user';
import {paginateResults} from './utils';

// All resolvers get these arguments:
// fieldName: (parent, args, context, info) => data

interface Context {
  dataSources: {sqlAPI: UserAPI};
}

// =============================================================================
// QUERY RESOLVER
// -----------------------------------------------------------------------------

const me: IFieldResolver<{}, Context> = async (_, __, {dataSources}) => {
  return dataSources.sqlAPI.currentUser();
};

const userInfo: IFieldResolver<{}, Context> = async (_, {id, name}, {dataSources}) => {
  return dataSources.sqlAPI.findUser({id, name});
};

const users: IFieldResolver<{}, Context> = async (_, __, {dataSources}) => {
  return dataSources.sqlAPI.allUsers();
};

const Query: IResolverObject<{}, Context> = {me, userInfo, users};

// =============================================================================
// MUTATION RESOLVER
// -----------------------------------------------------------------------------

const sendMessage: IFieldResolver<{}, Context> = async (_, {chatId, recipientId, content}, {dataSources}) => {
  const sentMessage = await dataSources.sqlAPI.sendMessage({chatId, recipientId, content});
  return sentMessage;
};

const login: IFieldResolver<{}, Context> = async (_, {name, password}, {dataSources}) => {
  const user = await dataSources.sqlAPI.findUser({name, password});
  if (user) return Buffer.from(name).toString('base64');
};

const createAccount: IFieldResolver<{}, Context> = async (_, {name, password}, {dataSources}) => {
  const user = await dataSources.sqlAPI.createUser({name, password});
  if (user) return Buffer.from(name).toString('base64');
};

const Mutation: IResolverObject<{}, Context> = {sendMessage, login, createAccount};

// =============================================================================
// USER RESOLVER
// -----------------------------------------------------------------------------

const chatPage: IFieldResolver<UserModel, Context> = async (_parentUser, {after, pageSize}, {dataSources}) => {
  const allChats = await dataSources.sqlAPI.getAllChatsByUser();
  const pagedChats = paginateResults<ChatModel>({
    after,
    pageSize,
    results: allChats,
    getCursor: item => `${item.id}`,
  });
  return {
    chats: pagedChats.map(pagedChat => ({
      ...pagedChat,
      createdAt: pagedChat.createdAt.toISOString(),
      updatedAt: pagedChat.updatedAt.toISOString(),
    })),
    cursor: pagedChats.length ? pagedChats[pagedChats.length - 1].id : null,
    hasMore: pagedChats.length ? pagedChats[pagedChats.length - 1].id !== allChats[allChats.length - 1].id : false,
  };
};

const chat: IFieldResolver<UserModel, Context> = async (_parentUser, {id}, {dataSources}) => {
  const chatOrNull = await dataSources.sqlAPI.getChatById({id});
  return (
    chatOrNull && {
      ...chatOrNull,
      createdAt: chatOrNull.createdAt.toISOString(),
      updatedAt: chatOrNull.updatedAt.toISOString(),
    }
  );
};

const User: IResolverObject<UserModel, Context> = {chatPage, chat};

// =============================================================================
// CHAT RESOLVER
// -----------------------------------------------------------------------------

const messagePage: IFieldResolver<ChatModel, Context> = async (parentChat, {after, pageSize}, {dataSources}) => {
  const allMessages = await dataSources.sqlAPI.getAllMessagesByChat({chatId: parentChat.id});
  const pagedMessages = paginateResults<MessageModel>({
    after,
    pageSize,
    results: allMessages,
    getCursor: item => `${item.id}`,
  });
  return {
    messages: pagedMessages.map(pagedMessage => ({
      ...pagedMessage,
      createdAt: pagedMessage.createdAt.toISOString(),
      updatedAt: pagedMessage.updatedAt.toISOString(),
    })),
    cursor: pagedMessages.length ? pagedMessages[pagedMessages.length - 1].id : null,
    hasMore: pagedMessages.length
      ? pagedMessages[pagedMessages.length - 1].id !== allMessages[allMessages.length - 1].id
      : false,
  };
};

const message: IFieldResolver<ChatModel, Context> = async (parentChat, {id}, {dataSources}) => {
  const messageOrNull = await dataSources.sqlAPI.getMessageById({chatId: parentChat.id, id});
  return (
    messageOrNull && {
      ...messageOrNull,
      createdAt: messageOrNull.createdAt.toISOString(),
      updatedAt: messageOrNull.updatedAt.toISOString(),
    }
  );
};

const Chat: IResolverObject<ChatModel, Context> = {messagePage, message};

// =============================================================================
// Bundle into resolvers object.
// -----------------------------------------------------------------------------

const resolvers: IResolvers<any, Context> = {Query, Mutation, User, Chat};

export default resolvers;
