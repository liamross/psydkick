import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {Connection} from 'typeorm';
import {Message} from '../models/message';

interface IContext {
  user: any;
}

interface ISendMessage {
  chatId: number;
  senderId: number;
  content: string;
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

  async sendMessage({chatId, senderId, content}: ISendMessage) {
    let message = new Message();
    message.chatId = chatId;
    message.senderId = senderId;
    message.content = content;

    const messageRepo = this.connection.getRepository(Message);
    message = await messageRepo.save(message);

    return message;
  }
}

module.exports = UserAPI;
