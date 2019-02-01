import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {Connection} from 'typeorm';
import {Chat} from '../models/chat';
import {Message} from '../models/message';
import {User} from '../models/user';

interface IContext {
  user: User;
}

interface IConvertedChat extends Chat {
  client: User;
  therapist: User;
}

interface IConvertedMessage extends Message {
  sender: User;
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

  public async findUser({id, name}: {id?: string | number; name?: string}): Promise<User | null> {
    if (!id && !name) throw new TypeError('Must provide one of id or name');
    const userRepo = this.connection.getRepository(User);

    // Check for existing user.
    const findObject: {id?: string | number; name?: string} = {};
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

  public async getAllChatsByUser(): Promise<IConvertedChat[]> {
    const userId = this.context && this.context.user && this.context.user.id;
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

  public async getChatById({id}: {id: number}): Promise<IConvertedChat | null> {
    const userId = this.context && this.context.user && this.context.user.id;
    const chatRepo = this.connection.getRepository(Chat);
    const chatOrUndefined = await chatRepo.findOne({
      where: [{clientId: userId, id}, {therapistId: userId, id}],
    });
    if (chatOrUndefined) return this.convertChat(chatOrUndefined);
    return null;
  }

  public async getAllMessagesByChat({chatId}: {chatId: number}): Promise<IConvertedMessage[]> {
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

  public async getMessageById({chatId, id}: {chatId: number; id: number}): Promise<IConvertedMessage | null> {
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
  }): Promise<IConvertedMessage> {
    const userId = this.context && this.context.user && this.context.user.id;

    // If no userId return string (which means error occurred).
    if (!userId) throw new Error('Not signed in');

    if (!chatId && !recipientId) throw new TypeError('Must provide one of chatId or recipientId');
    if (chatId && recipientId) throw new TypeError('Can not provide both chatId and recipientId');

    const message = new Message();
    message.senderId = userId;
    message.content = content;

    if (chatId) {
      // If no chat exists for this user, return string (which means error occurred).
      const chat = await this.getChatById({id: chatId});
      if (!chat) throw new Error('Invalid chat ID');
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

  private async convertChat(chat: Chat): Promise<IConvertedChat> {
    const client = await this.findUser({id: chat.clientId});
    const therapist = await this.findUser({id: chat.therapistId});
    if (!client) throw new Error('Client does not exist.');
    if (!therapist) throw new Error('Therapist does not exist.');
    return {...chat, client, therapist};
  }

  private async convertMessage(message: Message): Promise<IConvertedMessage> {
    const sender = await this.findUser({id: message.senderId});
    if (!sender) throw new Error('Sender does not exist.');
    return {...message, sender};
  }
}
