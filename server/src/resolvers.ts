import {IResolvers, IResolverObject, IFieldResolver} from 'graphql-tools';
import UserAPI from './datasources/sql';
import {paginateResults} from './utils';
import {User as UserModel} from './models/user';
import {Chat as ChatModel} from './models/chat';
import {Message as MessageModel} from './models/message';

// All resolvers get these arguments:
// fieldName: (parent, args, context, info) => data

interface IContext {
  dataSources: {sqlAPI: UserAPI};
}

// =============================================================================
// QUERY RESOLVER
// -----------------------------------------------------------------------------

const me: IFieldResolver<{}, IContext> = async (_, __, {dataSources}) => {
  return dataSources.sqlAPI.currentUser();
};

const userInfo: IFieldResolver<{}, IContext> = async (_, {id, name}, {dataSources}) => {
  return dataSources.sqlAPI.findUser({id, name});
};

const Query: IResolverObject<{}, IContext> = {me, userInfo};

// =============================================================================
// MUTATION RESOLVER
// -----------------------------------------------------------------------------

const sendMessage: IFieldResolver<{}, IContext> = async (
  _,
  {chatId, recipientId, senderId, content},
  {dataSources},
) => {
  const sentMessage = await dataSources.sqlAPI.sendMessage({chatId, recipientId, senderId, content});
  if (typeof sentMessage === 'string') {
    return {
      success: false,
      status: sentMessage,
      message: null,
    };
  }
  return {
    success: true,
    status: 'Message sent',
    message: sentMessage,
  };
};

const login: IFieldResolver<{}, IContext> = async (_, {name}, {dataSources}) => {
  const user = await dataSources.sqlAPI.findUser({name});
  if (user) return Buffer.from(name).toString('base64');
};

const createAccount: IFieldResolver<{}, IContext> = async (_, {name}, {dataSources}) => {
  const user = await dataSources.sqlAPI.createUser({name});
  if (user) return Buffer.from(name).toString('base64');
};

const Mutation: IResolverObject<{}, IContext> = {sendMessage, login, createAccount};

// =============================================================================
// USER RESOLVER
// -----------------------------------------------------------------------------

const chats: IFieldResolver<UserModel, IContext> = async (_parentUser, {after, pageSize}, {dataSources}) => {
  const allChats = await dataSources.sqlAPI.getAllChatsByUser();
  const pagedChats = paginateResults<ChatModel>({
    after,
    pageSize,
    results: allChats,
    getCursor: item => item.id,
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

const chat: IFieldResolver<UserModel, IContext> = async (_parentUser, {id}, {dataSources}) => {
  return dataSources.sqlAPI.getChatById({id});
};

const User: IResolverObject<UserModel, IContext> = {chats, chat};

// =============================================================================
// CHAT RESOLVER
// -----------------------------------------------------------------------------

const messages: IFieldResolver<ChatModel, IContext> = async (parentChat, {after, pageSize}, {dataSources}) => {
  const allMessages = await dataSources.sqlAPI.getAllMessagesByChat({chatId: parentChat.id});
  const pagedMessages = paginateResults<MessageModel>({
    after,
    pageSize,
    results: allMessages,
    getCursor: item => item.id,
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

const message: IFieldResolver<ChatModel, IContext> = async (parentChat, {id}, {dataSources}) => {
  return dataSources.sqlAPI.getMessageById({chatId: parentChat.id, id});
};

const Chat: IResolverObject<ChatModel, IContext> = {messages, message};

// =============================================================================
// Bundle into resolvers object.
// -----------------------------------------------------------------------------

const resolvers: IResolvers<any, IContext> = {Query, Mutation, User, Chat};

export default resolvers;
