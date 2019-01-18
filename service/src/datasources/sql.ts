import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {Connection} from 'typeorm';

import {User} from '../models/user';
import {Chat} from '../models/chat';
import {Message} from '../models/message';

interface IContext {
  user: any;
}

export default class UserAPI extends DataSource<IContext> {
  private connection: Connection;
  private context: IContext | null;

  constructor({connection}: {connection: Connection}) {
    super();
    this.connection = connection;
    this.context = null;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests.
   */
  initialize(config: DataSourceConfig<IContext>): void {
    this.context = config.context;
  }

  async findOrCreateUser({name}: {name?: string} = {}) {
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

  async getAllChats({pageSize, after}: {pageSize: number; after: string}) {
    const chatRepo = this.connection.getRepository(Chat);
    return chatRepo.find();
  }

  async getChatById({id}: {id: number}) {
    const chatRepo = this.connection.getRepository(Chat);
    return chatRepo.findOneOrFail({where: {id}});
  }

  async sendMessage({
    chatId,
    senderId,
    content,
  }: {
    chatId: number;
    senderId: number;
    content: string;
  }) {
    const message = new Message();
    message.chatId = chatId;
    message.senderId = senderId;
    message.content = content;

    const messageRepo = this.connection.getRepository(Message);
    return messageRepo.save(message);
  }
}

module.exports = UserAPI;
