import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {KeyValueCache} from 'apollo-server-core';
import {Connection} from 'typeorm';

import {User} from '../models/user';
import {Chat} from '../models/chat';
import {Message} from '../models/message';

interface IContext {
  user: User;
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
   * here, so we can know about the user making requests. Additionally, we will
   * assign this.cache to the request cache in order to access cached values.
   */
  public initialize(config: DataSourceConfig<IContext>): void {
    this.context = config.context;
  }

  public async currentUser(): Promise<User | null> {
    const name = this.context && this.context.user && this.context.user && this.context.user.name;
    if (!name) return null;
    return this.findUser({name});
  }

  public async findUser({id, name}: {id?: string; name?: string}): Promise<User | null> {
    if (!id && !name) throw new TypeError('Must provide one of id or name');
    const userRepo = this.connection.getRepository(User);

    // Check for existing user.
    const findObject: {id?: string; name?: string} = {};
    if (id) findObject.id = id;
    if (name) findObject.name = name;
    const existingUser = await userRepo.findOne({where: findObject});
    return existingUser || null; // Convert undefined to null.
  }

  public async createUser({name}: {name: string}): Promise<User | null> {
    const existingUser = await this.findUser({name});
    if (existingUser) return null; // Return null: user exists.

    // Else create a new user.
    const userRepo = this.connection.getRepository(User);
    const newUser = new User();
    newUser.name = name;
    return userRepo.save(newUser);
  }

  public async getAllChatsByUser(): Promise<Chat[]> {
    const userId = this.context && this.context.user && this.context.user.id;
    const chatRepo = this.connection.getRepository(Chat);
    return chatRepo.find({
      where: [{clientId: userId}, {therapistId: userId}],
      order: {createdAt: 'DESC'},
    });
  }

  public async getChatById({id}: {id: number}): Promise<Chat | null> {
    const userId = this.context && this.context.user && this.context.user.id;
    const chatRepo = this.connection.getRepository(Chat);
    const chatOrUndefined = await chatRepo.findOne({
      where: [{clientId: userId, id}, {therapistId: userId, id}],
    });
    return chatOrUndefined || null; // Convert undefined to null.
  }

  public async getAllMessagesByChat({chatId}: {chatId: number}): Promise<Message[]> {
    // If no chat exists for this user, return early.
    const chat = await this.getChatById({id: chatId});
    if (!chat) return [];

    const messageRepo = this.connection.getRepository(Message);
    return messageRepo.find({where: {chatId}, order: {createdAt: 'DESC'}});
  }

  public async getMessageById({chatId, id}: {chatId: number; id: number}): Promise<Message | null> {
    // If no chat exists for this user, return early.
    const chat = await this.getChatById({id: chatId});
    if (!chat) return null;

    const messageRepo = this.connection.getRepository(Message);
    const chatOrUndefined = await messageRepo.findOne({where: {chatId, id}});
    return chatOrUndefined || null; // Convert undefined to null.
  }

  public async sendMessage({
    chatId,
    recipientId,
    senderId,
    content,
  }: {
    chatId?: number;
    recipientId?: number;
    senderId: number;
    content: string;
  }): Promise<Message | string> {
    const userId = this.context && this.context.user && this.context.user.id;

    // If no userId return string (which means error occurred).
    if (!userId) return 'Not signed in';

    if (!chatId && !recipientId) throw new TypeError('Must provide one of chatId or recipientId');
    if (chatId && recipientId) throw new TypeError('Can not provide both chatId and recipientId');

    const message = new Message();
    message.senderId = senderId;
    message.content = content;

    if (chatId) {
      // If no chat exists for this user, throw.
      const chat = await this.getChatById({id: chatId});
      if (!chat) return 'Invalid chat ID';
      message.chatId = chatId;
    }

    if (recipientId) {
      const chatRepo = this.connection.getRepository(Chat);
      const chat = new Chat();
      // Therapist is sending the initial message.
      chat.therapistId = senderId;
      chat.clientId = recipientId;
      const newChat = await chatRepo.save(chat);
      message.chatId = newChat.id;
    }

    const messageRepo = this.connection.getRepository(Message);
    return messageRepo.save(message);
  }
}
