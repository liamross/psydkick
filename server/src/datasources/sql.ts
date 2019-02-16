import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {Connection} from 'typeorm';
import {Chat} from '../models/chat';
import {Message} from '../models/message';
import {User} from '../models/user';
import {isId, logger} from '../utils';
import {InputError, ValidationError, DatabaseError} from '../errors';
import {checkPassword, hashPassword} from '../password';

interface Context {
  user: User | null;
}

interface ConvertedChat extends Chat {
  client: User;
  therapist: User;
}

interface ConvertedMessage extends Message {
  sender: User;
}

export default class UserAPI extends DataSource<Context> {
  private connection: Connection;
  private context!: Context;

  public constructor({connection}: {connection: Connection}) {
    super();
    this.connection = connection;
    // this.context = null;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests. Additionally, we will
   * assign this.cache to the request cache in order to access cached values.
   */
  public initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }

  public async currentUser(): Promise<User> {
    logger('sql.currentUser');
    return this.validateUser();
  }

  public async allUsers(): Promise<User[]> {
    logger('sql.allUsers');
    const userRepo = this.connection.getRepository(User);
    return userRepo.find();
  }

  public async findUser({
    id,
    name,
    password,
  }: {
    id?: string | number;
    name?: string;
    password?: string;
  }): Promise<User | null> {
    logger('sql.findUser', id, name);
    if (!isId(id) && !name) throw new InputError('Must provide one of `id` or `name`');
    const userRepo = this.connection.getRepository(User);

    // Check for existing user.
    const findObject: {id?: string | number; name?: string} = {};
    if (isId(id)) findObject.id = id;
    if (name) findObject.name = name;
    const existingUser = await userRepo.findOne({where: findObject});
    if (existingUser && password) {
      if (await checkPassword(existingUser, password)) return existingUser;
      return null;
    }
    return existingUser || null; // Convert undefined to null.
  }

  public async createUser({name, password}: {name: string; password: string}): Promise<User | null> {
    logger('sql.createUser', name);
    const existingUser = await this.findUser({name});
    if (existingUser) return null; // Return null: user exists.

    // Else create a new user.
    const userRepo = this.connection.getRepository(User);
    const newUser = new User();
    newUser.name = name;
    newUser.passwordHash = await hashPassword(password);
    return userRepo.save(newUser);
  }

  public async getAllChatsByUser(): Promise<ConvertedChat[]> {
    const {id: userId} = this.validateUser();
    logger('sql.getAllChatsByUser', userId);
    const chatRepo = this.connection.getRepository(Chat);
    const chats = await chatRepo.find({
      where: [{clientId: userId}, {therapistId: userId}],
      order: {createdAt: 'DESC'},
    });
    const returnArray = [];
    for (const chat of chats) {
      const convertedChat = await this.convertChat(chat);
      returnArray.push(convertedChat);
    }
    return returnArray;
  }

  public async getChatById({id}: {id: number}): Promise<ConvertedChat | null> {
    logger('sql.getChatById', id);
    const {id: userId} = this.validateUser();
    const chatRepo = this.connection.getRepository(Chat);
    const chatOrUndefined = await chatRepo.findOne({
      where: [{clientId: userId, id}, {therapistId: userId, id}],
    });
    if (chatOrUndefined) return this.convertChat(chatOrUndefined);
    return null;
  }

  public async getAllMessagesByChat({chatId}: {chatId: number}): Promise<ConvertedMessage[]> {
    logger('sql.getAllMessagesByChat', chatId);
    // If no chat exists for this user, return early.
    const chat = await this.getChatById({id: chatId});
    if (!chat) return [];

    const messageRepo = this.connection.getRepository(Message);
    const messages = await messageRepo.find({where: {chatId}, order: {createdAt: 'DESC'}});
    const returnArray = [];
    for (const message of messages) {
      const convertedMessage = await this.convertMessage(message);
      returnArray.push(convertedMessage);
    }
    return returnArray;
  }

  public async getMessageById({chatId, id}: {chatId: number; id: number}): Promise<ConvertedMessage | null> {
    logger('sql.getMessageById', chatId, id);
    // If no chat exists for this user, return early.
    const chat = await this.getChatById({id: chatId});
    if (!chat) return null;

    const messageRepo = this.connection.getRepository(Message);
    const messageOrUndefined = await messageRepo.findOne({where: {chatId, id}});
    if (messageOrUndefined) return this.convertMessage(messageOrUndefined);
    return null;
  }

  public async sendMessage({
    chatId,
    recipientId,
    content,
  }: {
    chatId?: number;
    recipientId?: number;
    content: string;
  }): Promise<ConvertedMessage> {
    logger('sql.sendMessage', chatId, recipientId, content);
    const {id: userId} = this.validateUser();

    if (!isId(chatId) && !isId(recipientId)) {
      throw new InputError('Must provide one of `chatId` or `recipientId`');
    }
    if (isId(chatId) && isId(recipientId)) {
      throw new InputError('Can not provide both `chatId` and `recipientId`');
    }

    const message = new Message();
    message.senderId = userId;
    message.content = content;

    if (chatId) {
      // If no chat exists for this user, return string (which means error occurred).
      const chat = await this.getChatById({id: chatId});
      if (!chat) throw new DatabaseError('Chat does not exist');
      message.chatId = chatId;
    }

    if (recipientId) {
      const chatRepo = this.connection.getRepository(Chat);
      const chat = new Chat();
      // Therapist is sending the initial message.
      chat.therapistId = userId;
      chat.clientId = recipientId;
      const newChat = await chatRepo.save(chat);
      message.chatId = newChat.id;
    }

    const messageRepo = this.connection.getRepository(Message);
    const savedMessage = await messageRepo.save(message);

    return this.convertMessage(savedMessage);
  }

  private validateUser(): User {
    const user = this.context.user;
    logger('sql.validateUser', user);
    if (!user) throw new ValidationError();
    return user;
  }

  private async convertChat(chat: Chat): Promise<ConvertedChat> {
    logger('sql.convertChat', chat);
    // const client = await this.findUser({id: chat.clientId});
    // TODO: Remove this mock once you are picking users.
    const client = await this.findUser({id: chat.therapistId});
    const therapist = await this.findUser({id: chat.therapistId});
    if (!client) throw new DatabaseError('Client does not exist.');
    if (!therapist) throw new DatabaseError('Therapist does not exist.');
    return {...chat, client, therapist};
  }

  private async convertMessage(message: Message): Promise<ConvertedMessage> {
    logger('convertMessage', message);
    const sender = await this.findUser({id: message.senderId});
    if (!sender) throw new DatabaseError('Sender does not exist.');
    return {...message, sender};
  }
}
