import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {KeyValueCache} from 'apollo-server-core';
import {Connection} from 'typeorm';

import {User} from '../models/user';
import {Chat} from '../models/chat';
import {Message} from '../models/message';

interface IContext {
  user: any;
}

interface IFindOrCreateUserInput {
  name?: string;
}

interface IGetAllChatsInput {
  pageSize: number;
  after: string;
}

interface IGetChatByIdInput {
  id: number;
}

interface ISendMessageInput {
  chatId: number;
  senderId: number;
  content: string;
}

export default class UserAPI extends DataSource<IContext> {
  private connection: Connection;
  private context: IContext | null;
  private cache: KeyValueCache | null;

  constructor({connection}: {connection: Connection}) {
    super();
    this.connection = connection;
    this.context = null;
    this.cache = null;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests. Additionally, we will
   * assign this.cache to the request cache in order to access cached values.
   */
  initialize(config: DataSourceConfig<IContext>): void {
    this.context = config.context;
    this.cache = config.cache;
    console.log(this.context, this.cache); // TODO: Use this
  }

  async findOrCreateUser({name}: IFindOrCreateUserInput = {}) {
    if (!name) return null;
    const userRepo = this.connection.getRepository(User);
    // Check for existing user.
    const existingUser = await userRepo.findOne({where: {name}});
    if (existingUser) return existingUser;
    // Else create a new user.
    const user = new User();
    user.name = name;
    return userRepo.save(user);
  }

  async getAllChats({pageSize, after}: IGetAllChatsInput) {
    console.log(pageSize, after); // TODO: Use these
    const chatRepo = this.connection.getRepository(Chat);
    return chatRepo.find();
  }

  async getChatById({id}: IGetChatByIdInput) {
    const chatRepo = this.connection.getRepository(Chat);
    return chatRepo.findOneOrFail({where: {id}});
  }

  async sendMessage({chatId, senderId, content}: ISendMessageInput) {
    const message = new Message();
    message.chatId = chatId;
    message.senderId = senderId;
    message.content = content;

    const messageRepo = this.connection.getRepository(Message);
    return messageRepo.save(message);
  }
}

module.exports = UserAPI;
